"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import { RxSpeakerLoud } from "react-icons/rx";
import { AiFillCloseCircle } from "react-icons/ai";
import { GoMute } from "react-icons/go";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { BlobVideo, StreamVideo, useMediaCapture } from 'react-media-capture';
import { toast } from 'react-toastify';
import Crypto from "crypto-js";
import { TbCapture } from "react-icons/tb";
import Quagga from 'quagga';
// import Quagga from '@ericblade/quagga2';
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScanner, QrcodeErrorCallback } from "html5-qrcode";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { BrowserQRCodeReader } from '@zxing/browser';


import { AppHeader, Button, DialogBox, Timer, BarcodeCaptureModal } from "@/components";
import { testData, setStartTime, setEndTime, saveTestClip, setUploadStatus, saveBarcode, saveConfirmationNo } from '@/redux/slices/drugTest';
import { detectBarcodes, uploadVideoToS3, createPresignedUrl/*, videoEncoder */ } from './action';
import { base64ToFile, blobToBase64, blobToBuffer, blobToUint8Array, dateTimeInstance, fileToBase64 } from '@/utils/utils';
import { storeBlobInIndexedDB } from '@/utils/indexedDB';
import { authToken } from '@/redux/slices/auth';
import usePageVisibility from '@/hooks/visibilityHook';
import { appData } from '@/redux/slices/appConfig';
import { videoEncoder } from '@/utils/ffmpeg';

function Test() {
    const cameraRef = useRef<Webcam | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const ffmpegRef = useRef(new FFmpeg());

    const [activeStep, setActiveStep] = useState<number>(1);
    const [toggleContent, setToggleContent] = useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [test, setTest] = useState<any>([]);
    const [timerStep, setTimerStep] = useState<number | null>(null);
    const [testStart, setTestStart] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [barcodeStep, setBarcodeStep] = useState<boolean>(false);
    const [showBCModal, setShowBCModal] = useState<boolean>(false);
    const [barcode, setBarcode] = useState<string>('');
    const [barcodeImage, setBarcodeImage] = useState<string>('');
    const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
    const [isFinal, setIsFinal] = useState<boolean>(false);

    const timerId = useRef<NodeJS.Timeout | undefined>()

    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { testSteps, testStepsFiltered, timerObjs, testingKit, startTime, endTime, signature } = useSelector(testData);
    const { participant_id } = useSelector(authToken);
    const { first_name, last_name } = useSelector(appData);

    const isVisible = usePageVisibility();

    const {
        status,
        liveVideo,
        capturedVideo,
        devices,
        duration,
        volume,
        selectedDeviceId,
        lastError,

        record,
        pause,
        resume,
        stop,
        clear,
        selectDevice,
    } = useMediaCapture({ watchVolume: true });

    const TEST_UPLOAD = useCallback(async () => {
        try {
            const response = await fetch("/api/test-upload", {
                method: "POST",
                headers: {
                    participant_id: participant_id as string,
                    url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.mp4',
                    photo_url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    start_time: startTime,
                    end_time: endTime,
                    submitted: '1706033912',
                    barcode_string: barcode,
                    internet_connection: 'true',
                    app_version: '1.0.0',
                    os_version: '14.6',
                    phone_model: 'iPhone 12',
                    device_name: 'iPhone 12',
                    device_storage: '64GB',
                    look_away_time: '0',
                    hand_out_of_frame: '0',
                    drugkitname: testingKit.kit_name,
                    tracking_number: '1234567890',
                    shippinglabelURL: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    scan_barcode_kit_value: '1234567890',
                    detect_kit_value: '1234567890',
                    signature_screenshot: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    proof_id: '1234567890',
                    face_compare_url: '',
                    face_scan1_url: '',
                    face_scan2_url: '',
                    face_scan3_url: '',
                    face_scan1_percentage: '100',
                    face_scan2_percentage: '100',
                    face_scan3_percentage: '100',
                    image_capture1_url: '',
                    image_capture2_url: '',
                    passport_photo_url: '',
                    government_photo_url: '',
                    first_name: first_name,
                    last_name: last_name,
                    date_of_birth: '1990-01-01',
                    address: '1234 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipcode: '12345',
                },
            });
            const data = await response.json();
            if (data.data.statusCode === 200) {
                console.log(data.data);
                dispatch(saveConfirmationNo(data.data.confirmationNum));
                return data.data;
            } else {
                console.error(data.data);
            }
        } catch (error) {
            console.error("Self Drug Test Upload error:", error);
        }
    }, [barcode, dispatch, endTime, first_name, last_name, participant_id, startTime, testingKit.kit_name]);


    const TEST_VID_UPLOAD = useCallback(async (pendingTest: () => void, blob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('video', blob, `${testingKit.kit_id}.mp4`);

            const buffer = await blobToBuffer(blob);

            dispatch(setUploadStatus(true));

            await TEST_UPLOAD()

            await createPresignedUrl(`${testingKit.kit_id}.mp4`).then((response: any) => {
                if (response) {
                    const url = response;
                    fetch(url, {
                        method: 'PUT',
                        body: buffer as Buffer,
                        headers: { "Content-Length": blob!.size as unknown as string }
                    }).then((response) => {
                        console.log('s3 upload res-->', response)
                        if (response.ok && response.status === 200) {
                            dispatch(setUploadStatus(false));
                        } else {
                            pendingTest();
                            toast.error('Error uploading video');
                        }
                    }).catch((error) => {
                        pendingTest();
                        console.error('S3 Upload Error:', error)
                    });
                } else {
                    pendingTest();
                    toast.error('Error uploading video');
                }
            }).catch((error) => {
                pendingTest();
                console.error('Presigned URL Error:', error);
            });
        } catch (error) {
            pendingTest();
            console.error("Upload error:", error);
        }
    }, [TEST_UPLOAD, dispatch, testingKit.kit_id]);


    const endTest = useCallback(async () => {
        setMuted(true);
        stop();
        setIsFinal(true);
        mediaRecorderRef.current?.stop();
        dispatch(setEndTime(dateTimeInstance()));
    }, [dispatch, stop]);

    const handleDialog = useCallback(() => {
        setShowDialog(!showDialog);
    }, [showDialog]);

    const handleNextStep = useCallback(() => {
        if (activeStep === test.length) {
            endTest();
        } else {
            //Logic helps timer step stay on track with the active step
            if (activeStep + 1 !== test[activeStep].step && test[activeStep].step !== null && activeStep === test[activeStep - 1].step) {
                setActiveStep(test[activeStep].step);
            } else if (time === 0 && timerStep !== activeStep) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                setShowTimer(true);
            }
        }
    }, [activeStep, endTest, test, time, timerStep]);

    const handleTimerEnd = useCallback(async () => {
        setShowTimer(false);
        setTime(0);
        setTimerStep(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, [])

    const muteAudio = () => {
        setMuted(!muted);
    };

    const repeatAudio = () => {
        const audio = document.getElementById('test-audio') as HTMLAudioElement;
        audio?.load();
    };

    const closeBCModal = () => {
        setBarcodeStep(false);
        setShowBCModal(false);
        setBarcodeUploaded(false);
        handleNextStep();
    };

    const barcodeCapture = useCallback(async () => {
        try {
            const imageSrc = cameraRef?.current!.getScreenshot();
            const formats = ['ean_13', 'qr_code', 'code_128', 'code_39', 'upc_a', 'upc_e', 'ean_8', 'pdf417', 'aztec', 'data_matrix', 'itf', 'code_93'];
            const readers = ['ean_reader', 'ean_5_reader', 'ean_2_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader'];

            const barcodeTypes = [Html5QrcodeSupportedFormats.AZTEC, Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39, Html5QrcodeSupportedFormats.DATA_MATRIX, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.ITF, Html5QrcodeSupportedFormats.PDF_417, Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E];

            const imageFile = await base64ToFile(imageSrc!, 'barcode.png', 'image/png');

            setBarcodeImage(imageSrc!);

            const rekognition = async () => {
                await detectBarcodes(imageSrc!).then((response) => {
                    if (response.TextDetections.length > 0) {
                        setBarcode(response.TextDetections[0].DetectedText);
                        setBarcodeUploaded(true);
                        dispatch(saveBarcode(response.TextDetections[0].DetectedText));
                    } else {
                        toast.error('No barcode detected. Please try again.');
                    }
                }).catch((error) => {
                    console.error('Rekognition Error:', error);
                })
            };

            Quagga.decodeSingle({
                decoder: {
                    readers: readers
                },
                locate: true, // try to locate the barcode in the image
                src: imageSrc!
            }, function (result: any) {
                console.log("result-->", result);
                if (result !== undefined && result !== null && result.codeResult !== undefined && result.codeResult !== null) {
                    const code = result.codeResult.code;
                    setBarcode(code);
                    setBarcodeUploaded(true);
                    dispatch(saveBarcode(code));
                } else {
                    toast.warn('No barcode detected. Please try again.');
                    // rekognition();
                }
            })

            setShowBCModal(true);
        } catch (error) {
            toast.error('Error detecting barcode. Please try again.');
            console.error('Barcode Capture Error:', error);
        }
    }, [dispatch]);

    const reCaptureBarcode = () => {
        setBarcode('');
        setShowBCModal(false);
    };

    useEffect(() => {
        testStepsFiltered.length > 0 ? setTest(testStepsFiltered) : setTest(testSteps);

        // Start recording the video
        record();

        if (testStart) {
            dispatch(setStartTime(dateTimeInstance()));
            setTestStart(false);
        }

        // Checks if the timer will be active
        if (timerObjs.length > 0 && time === 0) {
            timerObjs.map((timerObj) => {
                if (timerObj.after_step === activeStep) {
                    setTimerStep(timerObj.after_step);
                    setTime(timerObj.step_time);
                }
            })
        }

        // Checks if the audio has ended to activate the timer
        if (!showTimer && activeStep === timerStep) {
            const audio = document.getElementById('test-audio') as HTMLAudioElement;
            audio.addEventListener('ended', () => {
                setShowTimer(true);
            });
        }

        if (test.length > 0) {
            const barcodeCap = test[activeStep - 1].is_barcode;
            barcodeCap ? setBarcodeStep(true) : null;
        }

        const handlePendingTest = async () => {
            const blobId = await storeBlobInIndexedDB(capturedVideo.blob, participant_id as string);

            if (typeof window !== 'undefined') {
                const testPending = {
                    kit: testingKit,
                    startTime: startTime,
                    endTime: endTime,
                    id: blobId
                }
                const encryptedpendingTest = Crypto.AES.encrypt(JSON.stringify(testPending), process.env.NEXT_PUBLIC_SECRET_KEY as string).toString();
                localStorage.setItem('pendingTest', encryptedpendingTest);
            }

            dispatch(setUploadStatus(undefined));
        };

        // Saves, processes and uploads the video/test results to the server
        if (status === 'recorded' && capturedVideo.blob) {
            // Self invoking function to upload the video to S3
            (async () => {
                try {
                    if (process.env.NODE_ENV !== 'development') {
                        dispatch(setUploadStatus(true));
                        await TEST_VID_UPLOAD(handlePendingTest, capturedVideo.blob);
                    } else {
                        const formData = new FormData();
                        formData.append('video', capturedVideo.blob, 'video.mp4');
                        dispatch(setUploadStatus(true));

                        await TEST_UPLOAD()

                        await uploadVideoToS3(formData, `${testingKit.kit_id}.mp4`).then((response) => {
                            if (response['$metadata'].httpStatusCode === 200) {
                                dispatch(setUploadStatus(false));
                            } else {
                                handlePendingTest();
                                toast.error('Error uploading video');
                            }
                        }).catch((error) => {
                            handlePendingTest();
                            console.error('S3 Upload Error:', error)
                        });
                    }
                } catch (error) {
                    handlePendingTest();
                    console.error("Upload error:", error);
                }
            })();

            const url = URL.createObjectURL(capturedVideo.blob);
            dispatch(saveTestClip(url));
            router.push('/test-collection/collection-summary')
        }

        //Streams the video to the AI detection service
        if (status === 'previewing') {
            const handleStreaming = async () => {
                console.log('I am recording--->');

                if (cameraRef?.current?.stream !== undefined && cameraRef?.current?.stream !== null) {
                    // If there's an existing MediaRecorder, stop it and remove the event listener
                    if (mediaRecorderRef.current) {
                        mediaRecorderRef.current.stop();
                        mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
                    }

                    // Create a new MediaRecorder instance
                    mediaRecorderRef.current = new MediaRecorder(cameraRef.current.stream as MediaStream, {
                        mimeType: 'video/webm;codecs=vp8', audioBitsPerSecond: 128000, videoBitsPerSecond: 2500000
                    });

                    // Add the dataavailable event listener
                    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);

                    // Start recording
                    mediaRecorderRef.current.start(60000);
                    console.log('mediaRecorderRef--->', mediaRecorderRef.current);
                }
            };

            const handleDataAvailable = async ({ data }: BlobEvent) => {
                console.log('stream data--->', data);
                try {
                    if (data.size > 0) {
                        console.log('stream data-2--->', data);

                        // const ffmpeg = new FFmpeg();
                        const ffmpeg = ffmpegRef.current;

                        // Ensure FFmpeg is loaded
                        if (!ffmpeg.loaded) {
                            await ffmpeg.load();
                        }

                        // Process the video blob to add metadata
                        const fileName = 'initstream.webm';
                        const outputFileName = 'outputstream.mp4';

                        // await ffmpeg.writeFile(fileName, await fetchFile(data));
                        console.log('ffmpeg file p1');

                        // await ffmpeg.exec(['-i', fileName, '-r', '30', '-c:v', 'libx264', '-c:a', 'aac', outputFileName]).catch((error) => {
                        //   console.error('FFmpeg Error:', error);
                        // });

                        console.log('ffmpeg file p2');
                        // const processedData = await ffmpeg.readFile(outputFileName); //returns a Unit8Array

                        console.log('ffmpeg file p3');
                        // const processedBlob = new Blob([processedData], { type: 'video/mp4' });

                        // console.log('ffmpeg blob:', processedBlob);

                        // Convert Blob data to File then to base64
                        // const file = new File([processedBlob], 'video.mp4', { type: 'video/mp4' });
                        // const fileData = await fileToBase64(file);

                        const vidArray = await blobToUint8Array(data);
                        const fileData = await videoEncoder(vidArray);

                        // Create a downloadable link for the video
                        const url = URL.createObjectURL(fileData!.processedBlob);
                        const a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = "proof-stream.mp4";
                        a.click();

                        // Send data to the server
                        const response = await fetch(`${process.env.NEXT_PUBLIC_BEAM_URL}`, {
                            method: "POST",
                            headers: {
                                "Accept": "*/*",
                                "Accept-Encoding": "gzip, deflate",
                                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                'chunks': fileData!.fileData,
                                'test_type': 'intercept',
                                'video_path': '',
                                'record': `${testingKit.name} - ${testingKit.kit_id}`,
                                'index': `${activeStep}`,
                                'is_final': isFinal ? 1 : 0
                            })
                        })

                        const analysis_data = await response.json();
                        console.log('beam res:', analysis_data);

                        // Stop the MediaRecorder and start a new one, to maintain the stream data integrity
                        handleStreaming();
                    }
                } catch (error) {
                    console.error('Stream Data Error :', error);
                }
            };

            // handleStreaming().catch((error) => {
            //   toast.error('Error streaming video, results maybe delayed. Contact support.');
            //   console.error('Stream Error:', error);
            // });
        }

        // Handle audio play and end events to show/hide buttons
        const audio = document.getElementById('test-audio') as HTMLAudioElement;
        const handleAudioPlay = () => setIsPlaying(true);
        const handleAudioEnd = () => setIsPlaying(false);

        audio?.addEventListener('playing', handleAudioPlay);
        audio?.addEventListener('ended', handleAudioEnd);

        //Checks if the browser was closed or the tab was closed
        if (status === 'error' || status === 'recording' && pathname === `/test-collection/${testingKit.kit_id}`) {
            window.addEventListener('beforeunload', (event) => {
                event.preventDefault();
                handleDialog();
            });
        }

        return () => {
            audio?.removeEventListener('playing', handleAudioPlay);
            audio?.removeEventListener('ended', handleAudioEnd);
        };
    }, [TEST_UPLOAD, TEST_VID_UPLOAD, activeStep, cameraRef, capturedVideo, dispatch, endTest, endTime, handleDialog, isFinal, participant_id, pathname, record, router, showTimer, startTime, status, test, testStart, testSteps, testStepsFiltered, testingKit, testingKit.kit_id, time, timerObjs, timerStep])

    return (
        <>
            <DialogBox show={showDialog} handleReject={handleDialog} handleAccept={endTest} title='End Test' content='Are you sure you want to end your test?' rejectText='No' acceptText='Yes' />
            <div className="test-container">
                <div id="reader"></div>
                <div style={{ display: 'flex', width: '100%', padding: '16px' }}>
                    <AppHeader title='' />
                    <div className='test-audio'>
                        {muted ? <GoMute onClick={muteAudio} color='#adadad' style={{ cursor: 'pointer' }} /> : <RxSpeakerLoud onClick={muteAudio} color='#009cf9' style={{ cursor: 'pointer' }} />}
                        <AiFillCloseCircle color='red' onClick={handleDialog} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
                <div className='test-content'>
                    <BarcodeCaptureModal show={showBCModal} barcode={barcode} barcodeImage={barcodeImage} barcodeUploaded={barcodeUploaded} step={activeStep} totalSteps={test.length} recapture={reCaptureBarcode} closeModal={closeBCModal} />
                    <Webcam
                        className='test-camera-container'
                        ref={cameraRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={{
                            facingMode: "user"
                        }}
                        imageSmoothing={true}
                    />
                    <div className='test-details'>
                        {test.map((step: any, index: number) => {
                            if (activeStep === step.step && step.step !== null) {
                                return (
                                    <React.Fragment key={index}>
                                        <div className='test-header' key={index + 1}>
                                            <p className='test-steps'>{`Step ${step.step} of ${test.length}`}</p>
                                            <div className='td-btns' style={isPlaying ? { justifyContent: 'center' } : {}}>
                                                {!isPlaying && <Button classname='td-left' onClick={repeatAudio}>Repeat</Button>}
                                                <div className='double-btns'>
                                                    <Button classname={!toggleContent ? 'db-blue' : 'db-white'} style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }} onClick={() => setToggleContent(false)} >Graphics</Button>
                                                    <Button classname={toggleContent ? 'db-blue' : 'db-white'} style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }} onClick={() => setToggleContent(true)} >Text</Button>
                                                </div>
                                                {!isPlaying && !barcodeStep && <Button classname="td-right" onClick={handleNextStep} >{showTimer ? 'Wait...' : 'Next'}</Button>}
                                                {!isPlaying && barcodeStep && <div style={{ width: '100%', maxWidth: '85px' }}></div>}
                                            </div>
                                        </div>
                                        <div style={{ position: 'relative' }} key={index + 2}>
                                            {!toggleContent ? <Image className='test-graphic' src={step.image_path} alt="Proof Test Image" width={5000} height={5000} loading='eager' unoptimized placeholder='blur' blurDataURL='image/png' />
                                                :
                                                <div className='test-text'>
                                                    <article className='test-step'>
                                                        <h5>{step.step}</h5>
                                                    </article>
                                                    <p className='t-text'>{step.directions}</p>
                                                </div>}
                                            {showTimer && <Timer time={time} showTimer={showTimer} handleEnd={handleTimerEnd} />}
                                        </div>
                                        <audio key={index + 3} id='test-audio' src={step.audio_path} controls autoPlay muted={muted} style={{ display: 'none' }} />
                                    </React.Fragment>
                                )
                            }
                        })}
                    </div>
                </div>
                {barcodeStep && <div className='barcode-btns'>
                    <Button classname='cap-btn' onClick={barcodeCapture}><TbCapture /> Capture</Button>
                </div>}
            </div>
        </>
    )
};

export default Test;
