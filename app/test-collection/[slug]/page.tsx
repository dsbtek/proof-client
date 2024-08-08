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
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScanner, QrcodeErrorCallback } from "html5-qrcode";
import { BrowserQRCodeReader } from '@zxing/browser';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from "react-query";

import { AppHeader, Button, DialogBox, Timer, BarcodeCaptureModal, Alert, Loader_, Loader } from "@/components";
import { testData, setStartTime, setEndTime, saveTestClip, setUploadStatus, saveBarcode, saveConfirmationNo, setFilename } from '@/redux/slices/drugTest';
import { detectBarcodes, uploadVideoToS3, createPresignedUrl/*, videoEncoder */ } from './action';
import { base64ToBlob, base64ToFile, blobToBase64, blobToBuffer, blobToUint8Array, dateTimeInstance, fileToBase64 } from '@/utils/utils';
import { storeBlobInIndexedDB } from '@/utils/indexedDB';
import { authToken } from '@/redux/slices/auth';
import usePageVisibility from '@/hooks/visibilityHook';
import { FacialCaptureString, IdCardFacialPercentageScoreString, appData } from '@/redux/slices/appConfig';
import useFaceDetector from '@/hooks/faceDetector';
import { compareFacesAI, detectBarcodesAI, detectBarcodesAI2 } from '@/utils/queries';
import useTestupload from '@/hooks/testUpload';


function Test() {
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
    const [barcodeIsLoading, setBarcodeIsLoading] = useState(false)
    const [barcodeImage, setBarcodeImage] = useState<string>('');
    const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
    const [performFaceScan, setPerformFaceScan] = useState<boolean>(false);
    const [performLabelScan, setPerformLabelScan] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const cameraRef = useRef<Webcam | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const blobCount = useRef(0);
    const isFinal = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const uuid = useRef(uuidv4());
    const timeRef = useRef(0);
    const stepNameRef = useRef(0);
    const activeStepRef = useRef(activeStep);
    const timerStepRef = useRef<null | number>(timerStep)
    const temperatureReaderRef = useRef(0);
    const faceScanRef = useRef(0);
    const barcodeStepRef = useRef(0);
    const labelScanRef = useRef(0);

    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { testSteps, testStepsFiltered, timerObjs, testingKit, startTime, endTime, signature, confirmationNo, filename } = useSelector(testData);
    const { participant_id } = useSelector(authToken);
    const { first_name, last_name } = useSelector(appData);
    const facialCapture = useSelector(FacialCaptureString);
    const facialScanScore = useSelector(IdCardFacialPercentageScoreString);
    const feedbackData = useSelector((state: any) => state.preTest.preTestFeedback);

    const isVisible = usePageVisibility();
    const { faceDetected } = useFaceDetector(cameraRef);
    const { uploader, testUpload } = useTestupload();

    // const { data: barcodeData, isLoading, refetch } = useQuery(["tutorial", barcodeImage], {
    //     queryFn: async ({ queryKey }) => {
    //         const [, barcodeImage] = queryKey;
    //         const data = await detectBarcodesAI(barcodeImage!);
    //         return data;
    //     },
    //     enabled: false,
    //     onSuccess: ({ data }: any) => {
    //         console.log('bc scan res:', data)
    //         if (data.status === 'complete') {
    //             const code = data.result[0].data;
    //             setBarcode(code);
    //             setBarcodeUploaded(true);
    //             dispatch(saveBarcode(code));
    //         }

    //         if (data.status === 'failed') {
    //             toast.warn(`${data.message}`)
    //         }
    //     },
    //     onError: (error: Error) => {
    //         toast.error("Sorry Cannot Fetch Data");
    //         console.error(error)
    //     }
    // });

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

    const endTest = useCallback(async () => {
        setIsSubmitting(true)
        isFinal.current = true
        setMuted(true);
        mediaRecorderRef.current?.stop();
        stop();
        dispatch(setEndTime(dateTimeInstance()));
    }, [dispatch, stop]);

    const handleDialog = useCallback(() => {
        setShowDialog(!showDialog);
    }, [showDialog]);

    const handleNextStep = useCallback(() => {
        if (activeStep === test.length) {
            if (testingKit.Scan_Shipping_Label && !performLabelScan) {
                setPerformLabelScan(true);
            } else {
                endTest();
            }
        } else {
            //Logic helps timer step stay on track with the active step
            if (activeStep + 1 !== test[activeStep].step && test[activeStep].step !== null && activeStep === test[activeStep - 1].step) {
                setActiveStep(test[activeStep].step);
            } else if (time === 0 && timerStep !== activeStep) {
                const newActiveStep = activeStep + 1;
                mediaRecorderRef.current?.stop();
                // setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setActiveStep(newActiveStep);
                setTimeout(() => {
                    timeRef.current = time;
                    stepNameRef.current = test[newActiveStep - 1].step_name;
                    activeStepRef.current = newActiveStep;
                    timerStepRef.current = typeof timerStep === 'number' ? 1 : 0;
                    temperatureReaderRef.current = test[newActiveStep - 1].is_temperature_reader ? 1 : 0;
                    faceScanRef.current = performFaceScan ? 1 : 0;
                    barcodeStepRef.current = barcodeStep ? 1 : 0;
                    labelScanRef.current = performLabelScan ? 1 : 0;
                }, 1000)
            } else {
                setShowTimer(true);
            }
        }
    }, [activeStep, barcodeStep, endTest, performFaceScan, performLabelScan, test, testingKit.Scan_Shipping_Label, time, timerStep]);

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
            setBarcodeIsLoading(true);
            const imageSrc = cameraRef?.current!.getScreenshot();
            const formats = ['ean_13', 'qr_code', 'code_128', 'code_39', 'upc_a', 'upc_e', 'ean_8', 'pdf417', 'aztec', 'data_matrix', 'itf', 'code_93'];
            const readers = ['ean_reader', 'ean_5_reader', 'ean_2_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader'];

            const barcodeTypes = [Html5QrcodeSupportedFormats.AZTEC, Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39, Html5QrcodeSupportedFormats.DATA_MATRIX, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.ITF, Html5QrcodeSupportedFormats.PDF_417, Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E];

            const imageFile = await base64ToFile(imageSrc!, 'barcode.png', 'image/png');

            setBarcodeImage(imageSrc!);

            // const barcodeResult = await detectBarcodesAI(imageSrc!);
            const barcodeResult = await detectBarcodesAI2(imageSrc!);

            // refetch();

            console.log('bc scan res:', barcodeResult)

            if (barcodeResult.status === 'complete') {
                // const code = barcodeResult.result[0].data;
                const code = barcodeResult.data.parsed;
                setBarcode(code);
                setBarcodeUploaded(true);
                dispatch(saveBarcode(code));
            }

            if (barcodeResult.status === 'error') {
                toast.warn(`${barcodeResult.message}`)
            }

            // Quagga.decodeSingle({
            //     decoder: {
            //         readers: readers
            //     },
            //     locate: true, // try to locate the barcode in the image
            //     src: imageSrc!
            // }, function (result: any) {
            //     console.log("result-->", result);
            //     if (result !== undefined && result !== null && result.codeResult !== undefined && result.codeResult !== null) {
            //         const code = result.codeResult.code;
            //         setBarcode(code);
            //         setBarcodeUploaded(true);
            //         dispatch(saveBarcode(code));
            //     } else {
            //         toast.warn('No barcode detected. Please try again.');
            //     }
            // })
            setBarcodeIsLoading(false);
            setShowBCModal(true);
        } catch (error) {
            setBarcodeIsLoading(false);
            toast.error('Error detecting barcode. Please try again.');
            console.error('Barcode Capture Error:', error);
        }
    }, [dispatch]);

    const reCaptureBarcode = () => {
        setBarcode('');
        setShowBCModal(false);
    };

    //Performs security and integrity checks
    useEffect(() => {
        if (performFaceScan) {
            const faceScan = cameraRef?.current!.getScreenshot();
            (async () => {
                try {
                    const similarity = await compareFacesAI(facialCapture.replace(/^data:image\/\w+;base64,/, ''), faceScan!.replace(/^data:image\/\w+;base64,/, ''));
                    console.log('simi in test-->', similarity.result.percentage)
                    // setPerformFaceScan(false);
                    dispatch
                } catch (error) {
                    console.error('Test Face Compare Error:', error);
                }
            })()
        };

        if (!audioRef.current) {
            audioRef.current = new Audio('/audio/user-notif.mp3');
        }

        if (faceDetected && isVisible && status !== 'acquiring') {
            audioRef.current.loop = false;
            audioRef.current.pause();
        } else {
            if (barcodeStep) return;
            audioRef.current.loop = true;
            audioRef.current.play();
        }

        // Cleanup function to pause audio when component unmounts
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [barcodeStep, dispatch, faceDetected, facialCapture, isVisible, performFaceScan, status, testingKit.Scan_Shipping_Label]);

    //General Test Collection functions and logic
    useEffect(() => {
        testStepsFiltered.length > 0 ? setTest(testStepsFiltered) : setTest(testSteps);

        // Ensures the first stream chunk has data
        if (test[0] && test[0].step === activeStep) {
            timeRef.current = time;
            stepNameRef.current = test[0].step_name;
            activeStepRef.current = test[0].step;
            timerStepRef.current = typeof timerStep === 'number' ? 1 : 0;
            temperatureReaderRef.current = test[activeStep - 1].is_temperature_reader ? 1 : 0;
            faceScanRef.current = performFaceScan ? 1 : 0;
            barcodeStepRef.current = barcodeStep ? 1 : 0;
            labelScanRef.current = performLabelScan ? 1 : 0;

            dispatch(setFilename(`${participant_id}-${testingKit.kit_name}-${testingKit.kit_id}-${uuid.current}`));
        }

        // Start recording the video
        record();

        if (testStart) {
            dispatch(setStartTime(dateTimeInstance()));
            setTestStart(false);
        }

        // Checks if the timer will be active
        if (timerObjs.length > 0 && time === 0 && status !== 'acquiring') {
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

        //Checks for actions to be performed during the testing process
        if (test.length > 0 && status !== 'acquiring') {
            const barcodeCapture = test[activeStep - 1].is_barcode;
            barcodeCapture && setBarcodeStep(true);

            const faceScan = test[activeStep - 1].is_scan_face;
            (faceScan && !performFaceScan) && setPerformFaceScan(true);
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
                        await uploader(capturedVideo.blob, handlePendingTest);
                    } else {
                        const formData = new FormData();
                        formData.append('video', capturedVideo.blob, 'video.mp4');
                        dispatch(setUploadStatus(true));

                        await testUpload();

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
            setIsSubmitting(false);

            if (feedbackData && feedbackData.length > 0) {
                router.push("/feedback")
            } else {
                router.push('/test-collection/collection-summary')
            }
        }

        // Handle audio play and end events to show/hide buttons
        const audio = document.getElementById('test-audio') as HTMLAudioElement;
        const handleAudioPlay = () => setIsPlaying(true);
        const handleAudioEnd = () => setIsPlaying(false);

        audio?.addEventListener('playing', handleAudioPlay);
        audio?.addEventListener('ended', handleAudioEnd);

        //Checks if the browser was closed or the tab was closed
        function beforeUnloadHandler(event: BeforeUnloadEvent) {
            event.preventDefault();
            handleDialog();
        }

        if (status === 'error' || status === 'recording' && pathname === `/test-collection/${testingKit.kit_id}`) {
            window.addEventListener('beforeunload', beforeUnloadHandler);
        }

        return () => {
            audio?.removeEventListener('playing', handleAudioPlay);
            audio?.removeEventListener('ended', handleAudioEnd);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [activeStep, barcodeStep, cameraRef, capturedVideo, dispatch, endTest, endTime, feedbackData, handleDialog, isFinal, participant_id, pathname, performFaceScan, performLabelScan, record, router, showTimer, startTime, status, test, testStart, testSteps, testStepsFiltered, testUpload, testingKit, testingKit.kit_id, time, timerObjs, timerStep, uploader])


    //Streams the video to the AI detection service
    useEffect(() => {
        const handleStreaming = async () => {
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
                mediaRecorderRef.current.start(30000);
            }
        };

        const handleDataAvailable = async ({ data }: BlobEvent) => {
            try {
                if (data.size > 0) {
                    console.log('stream data--->', data);
                    // Stop the MediaRecorder and starts a new one, to maintain the stream data integrity
                    if (isFinal.current === false) {
                        handleStreaming();
                    }

                    const unencodedString = await blobToBase64(data);
                    console.log('as:', activeStep)
                    const body = JSON.stringify({
                        'chunks': unencodedString,
                        'test_type': `${testingKit.kit_id}`,
                        'video_path': '',
                        'record': filename,
                        // 'record': `${participant_id}-${testingKit.kit_name}-${testingKit.kit_id}-${uuid.current}`,
                        'index': blobCount.current,
                        'is_final': isFinal.current ? 1 : 0,
                        'step': {
                            step_time: timeRef.current,
                            step_name: stepNameRef.current,
                            step: activeStepRef.current,
                            is_timed: timerStepRef.current,
                            is_temperature_reader: temperatureReaderRef.current,
                            is_scan_face: faceScanRef.current,
                            is_barcode: barcodeStepRef.current,
                            shippinglabel: labelScanRef.current
                        }
                    })

                    //Indexs the blob chunks being sent
                    blobCount.current += 1;

                    // Send data to the AI server
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BEAM_URL}`, {
                        method: "POST",
                        headers: {
                            "Accept": "*/*",
                            "Accept-Encoding": "gzip, deflate",
                            "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                            "Content-Type": "application/json",
                            "Connection": "keep-alive"
                        },
                        body: body
                    })

                    const analysis_data = await response.json();
                    console.log('beam response:', analysis_data);

                    if (!response.ok) {
                        console.error(`Beam Server Error: ${response}`);
                    }

                    if (response.ok) {
                        if (analysis_data.status === 'error') {
                            isFinal.current = true;
                            mediaRecorderRef.current?.stop();
                            return;
                        }

                        if (analysis_data.status === 'pending' && !isFinal.current) {
                            toast.info('AI detecting...');
                        }

                        if (analysis_data.status === 'complete') {
                            if (analysis_data.result) {
                                const detections = Object.entries(analysis_data.result);
                                const link = filename;
                                const sendMail = async () => {
                                    const response = await fetch("/api/send-email", {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            'participant_id': participant_id,
                                            'date': endTime,
                                            'kit': testingKit.kit_name,
                                            'confirmation_no': confirmationNo,
                                            'videoLink': `https://proofdata.s3.amazonaws.com/${link}`,
                                            'face_scan_score': facialScanScore,
                                            'detections': detections
                                        })
                                    })
                                    const data = await response.json();
                                    console.log('sm data:', data)
                                };
                                await sendMail();
                                toast.success('AI detection complete!');
                            }
                        }
                        console.log('stream count:', blobCount.current);
                    }
                }
            } catch (error) {
                console.error('Stream Data Error :', error);
            }
        };

        //Activate streaming
        if (status === 'previewing') {
            handleStreaming().catch((error) => {
                toast.error('Error streaming video, results maybe delayed. Contact support.');
                console.error('Stream Error:', error);
            });
        }
    }, [activeStep, barcodeStep, cameraRef, confirmationNo, dispatch, endTime, facialScanScore, filename, isFinal, participant_id, performFaceScan, performLabelScan, status, test, testingKit.kit_id, testingKit.kit_name, time, timerStep])

    return (
        <>
            {isSubmitting && <Loader />}
            <DialogBox show={showDialog} handleReject={handleDialog} handleAccept={endTest} title='End Test' content2='Are you sure you want to end your test?' content1='WARNING: Ending the test before the final step will result in a failed test.' rejectText='No' acceptText='Yes' />
            <div className="test-container">
                {status !== 'acquiring' && !barcodeStep && <Alert show={faceDetected} />}
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
                                            {!toggleContent ? <Image className='test-graphic' src={step.image_path} alt="Proof Test Image" width={5000} height={5000} priority unoptimized placeholder='blur' blurDataURL='image/png' />
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
                    {barcodeIsLoading ? <Loader_ /> : <Button classname='cap-btn' onClick={barcodeCapture}><TbCapture /> Capture</Button>}
                </div>}
                {performLabelScan && <div className='barcode-btns'>
                    {barcodeIsLoading ? <Loader_ /> : <Button classname='cap-btn' onClick={barcodeCapture}><TbCapture /> Capture</Button>}
                </div>}
            </div>
        </>
    )
};

export default Test;