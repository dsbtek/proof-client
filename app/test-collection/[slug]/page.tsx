'use client';
import React, {
    useState,
    useRef,
    useCallback,
    useEffect,
    useMemo,
    forwardRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { useMediaCapture } from 'react-media-capture';
import { toast } from 'react-toastify';
import Crypto from 'crypto-js';
import { TbCapture } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import useResponsive from '@/hooks/useResponsive';
import { Button, DialogBox, Alert, Loader_, Loader } from '@/components';
import {
    testData,
    setStartTime,
    setEndTime,
    saveTestClip,
    setUploadStatus,
    setFilename,
    setFaceScans,
    setBarcodeKit,
    setShippingLabel,
    setTestStepTimestamp,
    setImageCaptures,
    setRemoveImageCaptures,
} from '@/redux/slices/drugTest';
import { blobToBase64, dateTimeInstance, hasText } from '@/utils/utils';
import { storeBlobInIndexedDB } from '@/utils/indexedDB';
import { authToken } from '@/redux/slices/auth';
import usePageVisibility from '@/hooks/useVisibility';
import {
    FacialCaptureString,
    IdCardFacialPercentageScoreString,
    setScanReport,
} from '@/redux/slices/appConfig';
import useFaceDetector from '@/hooks/faceDetector';
import { compareFacesAI } from '@/utils/queries';
import useTestupload from '@/hooks/testUpload';
import { uploadImagesToS3 } from '@/app/identity-profile/id-detection/step-1/action';
import { scoreMatrix } from '@/redux/slices/score-matrix';
import useMediaFunctions from '@/hooks/useMediaFunctions';
import MobileTestView from './Mobile';
import DesktopTestView from './Desktop';
import useGetDeviceInfo from '@/hooks/useGetDeviceInfo';
import { testingKit } from '@/redux/slices/drugTest';

type TODO = any;
type Step = {
    step_time: number;
    step_name: string;
    step: number;
    is_timed: boolean;
    is_temperature_reader: boolean;
    is_scan_face: boolean;
    is_capture_image: boolean;
    is_barcode: boolean;
    shippinglabel: boolean;
    ai_options: any;
    audio_path: string;
    browser_text: string;
    browser_image: string;
    browser_audio: string;
};

const VideoElement = forwardRef<
    HTMLVideoElement,
    React.VideoHTMLAttributes<HTMLVideoElement>
>((prop, ref) => {
    return (
        <video
            ref={ref}
            autoPlay
            muted
            playsInline
            className="test-camera-container"
            style={{
                display: 'flex',
                objectFit: 'cover',
                flexGrow: 1,
                backgroundColor: 'black',
            }}
        />
    );
});

// Explicitly set the displayName
VideoElement.displayName = 'VideoElement';

const MemoizedVideoElement = React.memo(VideoElement);

function Test() {
    //use states
    const [activeStep, setActiveStep] = useState<number>(1);
    const [trackImageCapture, setTrackImageCapture] = useState<string>('');
    const [uuid] = useState(uuidv4());
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [toggleContent, setToggleContent] = useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(false);
    const [barcodeIsLoading, setBarcodeIsLoading] = useState(false);
    const [openEnterManually, setOpenEnterManually] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [performLabelScan, setPerformLabelScan] = useState(false);
    const [barcode, setBarcode] = useState<string>('');
    const [barcodeUploaded, setBarcodeUploaded] = useState(false);
    const [showBCModal, setShowBCModal] = useState(false);
    const [scanType, setScanType] = useState<'test' | 'fedex'>('test');
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [test, setTest] = useState<any>([]);
    const [time, setTime] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    const [mediaError, setMediaError] = useState<string[]>([]);
    const [nextDisabled, setNextDisabled] = useState<boolean>(false);
    const [capturedBarcode, setCapturedBarcode] =
        useState<HTMLImageElement | null>(null);
    const [captureManualImage, setCaptureManualImage] =
        useState<boolean>(false);
    const [manualImageCaptureTimer, setManualImageCaptureTimer] =
        useState<number>(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [initialNextDisable, setInitialNextDisable] = useState<boolean>(true);

    //use refs
    const { status, capturedVideo, record, stop } = useMediaCapture({
        watchVolume: true,
    });
    const cameraRef = useRef<Webcam | null>(null);
    const isFinal = useRef(false);
    const blobCount = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    //hooks
    const dispatch = useDispatch();
    const router = useRouter();
    const isDesktop = useResponsive();
    const isVisible = usePageVisibility();
    const { faceDetected } = useFaceDetector(cameraRef);
    const { osName } = useGetDeviceInfo();

    const {
        startMediaRecorder,
        stopMediaRecorder,
        handleRequestData,
        videoRef,
        mediaRecorderRef,
        loading,
        onAIError,
        mimeType,
        stream,
    } = useMediaFunctions();

    const { uploader } = useTestupload();
    //redux data
    const scoringData = useSelector(scoreMatrix);
    const { participant_id } = useSelector(authToken);
    const facialCapture = useSelector(FacialCaptureString);
    const facialScanScore = useSelector(IdCardFacialPercentageScoreString);
    const feedbackData = useSelector(
        (state: any) => state.preTest?.preTestFeedback,
    );

    const {
        AIConfig,
        storage,
        lookAway,
        handsOut,
        testSteps,
        testStepsFiltered,
        timerObjs,
        testingKit,
        startTime,
        endTime,
        confirmationNo,
        filename,
        trackingNumber,
        shippingLabel,
        barcodeKit,
        detectKit,
        proofId,
        faceCompare,
        faceScans,
        imageCaptures,
        passport,
        governmentID,
        idDetails,
    } = useSelector(testData);
    // const {kit_name} = useSelector(testingKit);

    //functions
    //functions

    const handleDialog = () => {
        setShowDialog((prev) => !prev);
    };
    const muteAudio = () => {
        setMuted((prev) => !prev);
    };
    const repeatAudio = () => {
        const audio = document.getElementById('test-audio') as HTMLAudioElement;
        audio?.load();
    };

    const reCaptureBarcode = () => {
        setBarcode('');
        setShowBCModal(false);
        setBarcodeUploaded(false);
    };
    //Checks if the browser was closed or the tab was closed
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        handleDialog();
    };

    const handleAudioPlay = () => setIsPlaying(true);
    const handleAudioEnd = () => setIsPlaying(false);
    const handleSendDataForInference = async (body: any) => {
        if (typeof window !== 'undefined') {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BEAM_URL}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: '*/*',
                        'Accept-Encoding': 'gzip, deflate',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                        'Content-Type': 'application/json',
                        Connection: 'keep-alive',
                    },
                    body: body,
                },
            );
            const analysis_data = await response.json();
            if (!response.ok) {
                console.error(`Beam Server Error: ${response}`);
            }

            if (response.ok) {
                switch (analysis_data.status) {
                    case 'error':
                        isFinal.current = true;
                        onAIError();
                        return;
                    case 'success':
                        if (analysis_data.data) {
                            await sendMail(analysis_data);
                            toast.success('AI detection complete!');
                        }
                    case 'pending':
                    default:
                        toast.info('AI detecting...');
                }
            }
            // if (response.ok) {
            //   if (analysis_data.task_id) {
            //     console.log("task_id", analysis_data.task_id);
            //     const taskId = analysis_data.task_id;
            //     toast.info("AI detecting...");
            //     isFinal.current = true;
            //     setCanClose(true)

            //   }
            // }
        }
    };

    const handleDataAvailable = useCallback(
        async ({ data }: BlobEvent) => {
            console.log(
                'stream data--->',
                data,
                'is final result',
                isFinal.current,
                'matching steps',
                currentStep?.step == activeStep,
            );
            try {
                const keyFilename = filename.replace(
                    /[\/\(\)\[\]\{\}#&?%=+~`;*^$]/g,
                    '',
                );
                if (data.size) {
                    const unencodedString = await blobToBase64(data);
                    const body = JSON.stringify({
                        inference_config: AIConfig,
                        inference_score: scoringData[testingKit.kit_id],
                        chunks: unencodedString,
                        test_type: `${testingKit.kit_id}`,
                        video_path: '',
                        record: keyFilename,
                        index: blobCount.current,
                        is_final: isFinal.current,
                        step: currentStep,
                    });
                    //Indexs the blob chunks being sent
                    blobCount.current += 1;
                    // Send data to the AI server
                    handleSendDataForInference(body);
                    console.log('stream count:', blobCount.current);
                }
            } catch (error) {
                console.error('Stream Data Error :', error);
            }
        },
        [filename, currentStep, activeStep, blobCount.current, isFinal.current],
    );
    //callback functions

    const handleTimerEnd = useCallback(async () => {
        console.log('timer ended');
        setTime(0);
        handleRequestData();
        setTimeout(() => {
            setCurrentStep({
                step_time: test[activeStep].step_time ?? 0,
                step_name: test[activeStep].step_name,
                step: test[activeStep].step,
                is_timed: test[activeStep]?.is_timed,
                is_temperature_reader: test[activeStep].is_temperature_reader,
                is_scan_face: test[activeStep].is_scan_face,
                is_capture_image: test[activeStep].is_capture_image,
                is_barcode: test[activeStep]?.is_barcode,
                shippinglabel: performLabelScan,
                browser_text: test[activeStep].browser_text,
                browser_image: test[activeStep].browser_image,
                browser_audio: test[activeStep].browser_audio,
                ai_options: test[activeStep].ai_options,
                audio_path: test[activeStep].audio_path,
            });
            setActiveStep(activeStep + 1);
            setShowTimer(false);
        }, 1000);
    }, [activeStep, performLabelScan, test, time]);

    const closeBCModal = () => {
        setShowBCModal(false);
        setBarcodeUploaded(false);
        handleNextStep();
    };

    const barcodeCapture = useCallback(async () => {
        // console.log("we entered into this loop");
        setBarcodeIsLoading(true);
        try {
            const imageSrc = cameraRef?.current!.getScreenshot();
            currentStep?.is_barcode && setScanType('test');
            performLabelScan && setScanType('fedex');
            const img = new window.Image();
            img.src = imageSrc!;

            setCapturedBarcode(img!);

            if (currentStep?.is_barcode && !performLabelScan) {
                // console.log("barcode kit s3 upload block");
                const barcodeKitCapture = `${participant_id}-BarcodeKitCapture-${Date.now()}.png`;
                dispatch(setBarcodeKit(barcodeKitCapture));
                uploadImagesToS3(imageSrc!, barcodeKitCapture).catch(
                    (error) => {
                        console.error(
                            'barcode Kit Capture Upload Error:',
                            error,
                        );
                    },
                );
            }
            if (performLabelScan) {
                console.log('shipping kit s3 upload block');
                const shippingLabelCapture = `${participant_id}-ShippingLabelCapture-${Date.now()}.png`;
                // console.log(imageSrc, "image srcr");
                dispatch(setShippingLabel(shippingLabelCapture));
                uploadImagesToS3(imageSrc!, shippingLabelCapture).catch(
                    (error) => {
                        console.error(
                            'Shipping Label Capture Upload Error:',
                            error,
                        );
                    },
                );
            }
            setBarcodeUploaded(true);
            setShowBCModal(true);
        } catch (error) {
            toast.error('Error detecting barcode. Please try again.');
            console.error('Barcode Capture Error:', error);
        }
        setBarcodeIsLoading(false);
    }, [currentStep, performLabelScan]);
    const sendMail = useCallback(
        async (analysis_data: TODO) => {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                body: JSON.stringify({
                    config: AIConfig,
                    participant_id: participant_id,
                    date: endTime,
                    kit: testingKit.kit_name,
                    confirmation_no: confirmationNo,
                    videoLink: `https://proofdata.s3.amazonaws.com/${filename}`,
                    face_scan_score: facialScanScore,
                    detections: analysis_data.data,
                }),
            });
            const data = await response.json();
            console.log('sm data:', data);
        },
        [
            AIConfig,
            participant_id,
            endTime,
            testingKit,
            confirmationNo,
            filename,
            facialScanScore,
        ],
    );
    const handlePendingTest = async () => {
        const blobId = await storeBlobInIndexedDB(
            capturedVideo.blob,
            participant_id as string,
        );

        if (typeof window !== 'undefined') {
            const testPending = {
                kit: testingKit,
                startTime: startTime,
                endTime: endTime,
                id: blobId,
                filename: filename,
                barcode: barcode,
                storage: storage,
                lookAway: lookAway,
                handsOut: handsOut,
                trackingNumber: trackingNumber,
                shippingLabel: shippingLabel,
                barcodeKit: barcodeKit,
                detectKit: detectKit,
                proofId: proofId,
                faceCompare: faceCompare,
                faceScans: faceScans,
                imageCaptures: imageCaptures,
                passport: passport,
                governmentID: governmentID,
                idDetails: idDetails,
            };
            const encryptedpendingTest = Crypto.AES.encrypt(
                JSON.stringify(testPending),
                process.env.NEXT_PUBLIC_SECRET_KEY as string,
            ).toString();
            localStorage.setItem('pendingTest', encryptedpendingTest);
        }

        dispatch(setUploadStatus(undefined));
    };

    const handleCompareFacesAI = useCallback(
        async (faceScan: string, facialScan: string) => {
            try {
                const similarity = await compareFacesAI(
                    facialCapture.replace(/^data:image\/\w+;base64,/, ''),
                    faceScan!.replace(/^data:image\/\w+;base64,/, ''),
                );
                console.log('simi in test-->', similarity.result.percentage);
                // await uploadFileToS3(faceScan!, facialScan).catch((error) => {
                await uploadImagesToS3(faceScan!, facialScan).catch((error) => {
                    console.error('Facial Scan Upload Error:', error);
                });
                dispatch(
                    setFaceScans({
                        url: facialScan,
                        percentage: similarity.result.percentage,
                    }),
                );
            } catch (error) {
                console.error('Test Face Compare Error:', error);
            }
        },
        [],
    );
    const handleSubmit = async () => {
        // Saves, processes and uploads the video/test results to the server
        if (status === 'recorded' && capturedVideo.blob) {
            try {
                dispatch(setUploadStatus(true));
                uploader(capturedVideo.blob, handlePendingTest);
            } catch (error) {
                handlePendingTest();
                console.error('Upload error:', error);
            }

            const url = URL.createObjectURL(capturedVideo.blob);
            dispatch(saveTestClip(url));
            setIsSubmitting(false);
            if (
                testingKit?.kit_name.includes('Rapid Saliva Kit (OralTox/ALCO)')
            ) {
                router.push('/test-collection/rapid-test');
            } else if (feedbackData?.length > 0)
                return router.push('/feedback');
            else router.push('/test-collection/collection-summary');
        } else {
            console.log(status, capturedVideo);
        }
    };

    const endTest = async () => {
        setMuted(true);
        setShowDialog(false);
        setIsSubmitting(true);
        isFinal.current = true;
        dispatch(setEndTime((Date.now() / 1000).toFixed(0)));
        stop();
        stopMediaRecorder();
    };

    const handleNextStep = () => {
        // setIsPlaying(true);
        setNextDisabled(true);
        const finalIndex = test.length;
        handleRequestData();
        if (currentStep?.is_capture_image) {
            setTrackImageCapture('');
        }
        setTimeout(() => {
            // check if we are on the last step
            if (activeStep === finalIndex) {
                if (testingKit.Scan_Shipping_Label && !performLabelScan)
                    setPerformLabelScan(true);
                else endTest();
                return;
            }
            //check if current step has a time step after
            // Checks if the timer will be active
            const isTimerNext = timerObjs?.find(
                (timerObj) => timerObj.after_step === activeStep,
            );
            if (isTimerNext) {
                console.log('timer next-->', isTimerNext);
                setTime(isTimerNext.step_time);
                // const audio = document.getElementById("test-audio") as HTMLAudioElement;
                // Checks if the audio has ended to activate the timer
                setShowTimer(true);
                // audio.addEventListener("ended", () => {
                //   setShowTimer(true);
                // });
            } else {
                const newActiveStep = activeStep + 1; //Needs to be set because useState is asynchronous and does not update before assigning the values below
                setActiveStep(newActiveStep);
                setCurrentStep({
                    step_time: test[newActiveStep - 1].step_time ?? 0,
                    step_name: test[newActiveStep - 1].step_name,
                    step: test[newActiveStep - 1].step,
                    is_timed: test[newActiveStep - 1]?.is_timed,
                    is_temperature_reader:
                        test[newActiveStep - 1].is_temperature_reader,
                    is_scan_face: test[newActiveStep - 1].is_scan_face,
                    is_barcode: test[newActiveStep - 1].is_barcode,
                    is_capture_image: test[newActiveStep - 1].is_capture_image,
                    shippinglabel: performLabelScan,
                    ai_options: test[newActiveStep - 1].ai_options,
                    audio_path: test[newActiveStep - 1].audio_path,
                    browser_text: test[newActiveStep - 1].browser_text,
                    browser_image: test[newActiveStep - 1].browser_image,
                    browser_audio: test[newActiveStep - 1].browser_audio,
                });
                dispatch(
                    setTestStepTimestamp({
                        step: test[newActiveStep - 1].step,
                        time: (Date.now() / 1000).toFixed(0),
                    }),
                );
            }
            setNextDisabled(false);
            console.log('current step-->', currentStep);
        }, 1000);
        //this is done on the last step to trigger scan of shipping label
    };

    const capturedImageTrigger = useCallback(() => {
        try {
            if (cameraRef.current) {
                // Get the screenshot from webcam
                const imageSrc = cameraRef?.current?.getScreenshot();

                if (!imageSrc) {
                    toast.error('Failed to capture image');
                    return;
                }

                // Here you can:
                // 1. Save to state
                const imageCapture = `${participant_id}-ImageCapture-${Date.now()}.png`;
                uploadImagesToS3(imageSrc, imageCapture);
                setTrackImageCapture(imageSrc);
                dispatch(setImageCaptures(imageCapture));
                // handleNextStep();

                // return imageSrc;
            }
        } catch (error) {
            console.error('Error capturing image:', error);
            toast.error('Failed to capture image');
            return undefined;
        }
    }, []);

    const removeCapturedImage = () => {
        dispatch(setRemoveImageCaptures());
    };

    ///use effects

    //initializations
    useEffect(() => {
        setTimeout(() => {
            setInitialNextDisable(false);
        }, 2000);
    }, []);

    useEffect(() => {
        console.log(status, 'status');
        switch (status) {
            case 'previewing':
                dispatch(
                    setFilename(
                        `${participant_id}-${testingKit?.kit_name
                            ?.split(' ')
                            ?.join('-')}-${testingKit.kit_id}-${uuid}.mp4`,
                    ),
                );
                const finalTest = testStepsFiltered.length
                    ? testStepsFiltered
                    : testSteps;
                setTest(finalTest);
                (async () => {
                    await record({
                        mimeType: mimeType,
                    });
                    await startMediaRecorder();
                    dispatch(setStartTime((Date.now() / 1000).toFixed(0)));
                    finalTest?.[0] &&
                        setCurrentStep({
                            step_time: finalTest[0].step_time ?? 0,
                            step_name: finalTest[0].step_name,
                            step: finalTest[0].step,
                            is_timed: finalTest[0]?.is_timed,
                            is_temperature_reader:
                                finalTest[0].is_temperature_reader,
                            is_scan_face: finalTest[0].is_scan_face,
                            is_barcode: finalTest[0].is_barcode,
                            is_capture_image: finalTest[0].is_capture_image,
                            shippinglabel: false,
                            ai_options: finalTest[0].ai_options,
                            audio_path: finalTest[0].audio_path,
                            browser_text: finalTest[0].browser_text,
                            browser_image: finalTest[0].browser_image,
                            browser_audio: finalTest[0].browser_audio,
                        });
                })(); //todo
            case 'denied':
                const checkPermissions = async () => {
                    try {
                        const stream =
                            await navigator.mediaDevices.getUserMedia({
                                video: true,
                                audio: true,
                            });
                        stream.getTracks().forEach((track) => track.stop());
                    } catch (error) {
                        setMediaError((prev) => [
                            ...prev,
                            'Error accessing camera. Please allow camera and microphone access to continue.',
                        ]);
                        toast.error(
                            'Error accessing camera. Please allow camera and microphone access to continue.',
                        );
                    }
                    // try {
                    //   const stream = await navigator.mediaDevices.getUserMedia({
                    //     audio: true,
                    //   });
                    //   stream.getTracks().forEach((track) => track.stop());
                    // } catch (error) {
                    //   setMediaError((prev) => [
                    //     ...prev,
                    //     "Error accessing Microphone. Please allow microphone access to continue.",
                    //   ]);
                    //   console.error("Microphone Permissions Error:", error);
                    //   toast.error(
                    //     "Error accessing Microphone. Please allow microphone access to continue."
                    //   );
                    // }
                };
                checkPermissions();

            default:
        }

        addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            // mediaRecorderRef.current?.stop();
            removeEventListener('dataavailable', beforeUnloadHandler);
            removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [status]);

    //handle submit
    useEffect(() => {
        if (isFinal.current) {
            (async () => {
                await handleSubmit();
            })();
        }
    }, [capturedVideo, status]);

    useEffect(() => {
        if (mediaRecorderRef.current) {
            console.log('triggered', currentStep);
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        }

        return () => {
            mediaRecorderRef.current &&
                (mediaRecorderRef.current.ondataavailable = null);
        };
    }, [handleDataAvailable]);

    //user notification initialization
    useEffect(() => {
        // Ensure audioRef is initialized only once
        if (!audioRef.current) {
            audioRef.current = new Audio('/audio/user-notif.mp3');
        }
        const audio = audioRef.current;

        // Handle playing/pausing logic based on conditions
        if (faceDetected && isVisible && status !== 'acquiring') {
            !audio.paused && audio.pause(); // Pause if audio is currently playing
        } else if (!currentStep?.is_barcode) {
            if (audio.paused) {
                audio.loop = true;
                audio.play(); // Play if audio is currently paused
            }
        }
        // Cleanup function to ensure audio is paused when the component unmounts
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Reset to the start in case of future plays
            }
        };
    }, [currentStep?.is_barcode, faceDetected, status]);

    //listen to proof audio playing
    useEffect(() => {
        const audio = document.getElementById('test-audio') as HTMLAudioElement;
        audio?.addEventListener('playing', handleAudioPlay);
        audio?.addEventListener('ended', handleAudioEnd);
        return () => {
            audio?.removeEventListener('playing', handleAudioPlay);
            audio?.removeEventListener('ended', handleAudioEnd);
        };
    }, [activeStep]);
    //Performs facial scan comparison
    useEffect(() => {
        if (currentStep?.is_scan_face) {
            const faceScan = cameraRef?.current!.getScreenshot();
            const facialScan = `${participant_id}-FacialScan-${Date.now()}.png`;
            faceScan &&
                (async () =>
                    await handleCompareFacesAI(faceScan, facialScan))();
        }
    }, [facialCapture, currentStep, handleCompareFacesAI]);

    const startTimer = async (timeLimit: number) => {
        setManualImageCaptureTimer(timeLimit);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        timerIntervalRef.current = setInterval(() => {
            setManualImageCaptureTimer((prev) => {
                const updatedTime = prev - 1;
                if (updatedTime <= 0) {
                    clearInterval(timerIntervalRef.current as NodeJS.Timeout);
                    (async () => {
                        await barcodeCapture();
                    })();
                }
                return updatedTime;
            });
        }, 1000);
    };

    useEffect(() => {
        if (captureManualImage) {
            barcodeCapture();
            setCaptureManualImage(false);
        }
    }, [captureManualImage, barcodeCapture]);

    ///todo
    //set as soon as main recording starts
    const isNextDisabled = useMemo(
        () =>
            [
                initialNextDisable,
                nextDisabled,
                !currentStep,
                isPlaying,
                showTimer,
                currentStep?.is_barcode,
                performLabelScan,
                isSubmitting,
            ].some(Boolean),
        // activeStep === test.length,
        [
            showTimer,
            currentStep,
            isSubmitting,
            isPlaying,
            performLabelScan,
            nextDisabled,
        ],
    );
    if (mediaError.length) {
        return (
            <div
                style={{
                    backgroundColor: 'black',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4rem',
                    height: '100vh',
                    width: '100vw',

                    padding: '2rem',
                }}
            >
                {mediaError.map((item, i) => {
                    return (
                        <p
                            style={{
                                fontSize: '1.5rem',
                                color: 'white',
                            }}
                            key={i}
                        >
                            {item}
                        </p>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            {isSubmitting && <Loader />}
            <DialogBox
                show={showDialog}
                handleReject={handleDialog}
                handleAccept={endTest}
                title="End Test"
                content2="Are you sure you want to end your test?"
                content1="WARNING: Ending the test before the final step will result in a failed test."
                rejectText="No"
                acceptText="Yes"
            />
            <div className="test-container">
                {!loading && !currentStep?.is_barcode && !performLabelScan && (
                    <Alert show={faceDetected} />
                )}

                {!isDesktop ? (
                    <MobileTestView
                        isPlaying={isPlaying}
                        toggleContent={toggleContent}
                        barcodeStep={Boolean(currentStep?.is_barcode)}
                        handleTimerEnd={handleTimerEnd}
                        reCaptureBarcode={reCaptureBarcode}
                        closeBCModal={closeBCModal}
                        setToggleContent={setToggleContent}
                        repeatAudio={repeatAudio}
                        performLabelScan={performLabelScan}
                        handleNextStep={handleNextStep}
                        videoRef={videoRef}
                        cameraRef={cameraRef}
                        isNextDisabled={isNextDisabled}
                        isPrevDisabled={isPlaying}
                        scanType={scanType}
                        barcodeUploaded={barcodeUploaded}
                        activeStep={activeStep}
                        test={test}
                        showTimer={showTimer}
                        time={time}
                        muted={muted}
                        handleDialog={handleDialog}
                        showBCModal={showBCModal}
                        setShowBCModal={setShowBCModal}
                        muteAudio={muteAudio}
                        isScanditDisabled={osName === 'iOS'}
                        kitName={testingKit.kit_name}
                        videoStream={stream}
                        barcodeIsLoading={barcodeIsLoading}
                        barcodeCapture={barcodeCapture}
                        enterBarcode={openEnterManually}
                        setEnterBarcode={setOpenEnterManually}
                        barcodeValue={barcodeValue}
                        setBarcodeValue={setBarcodeValue}
                        capturedImage={capturedBarcode}
                        faceDetected={faceDetected}
                        capturedImageTrigger={capturedImageTrigger}
                        trackImageCapture={trackImageCapture}
                        setTrackImageCapture={setTrackImageCapture}
                        startManualCaptureFn={startTimer}
                        manualImageCaptureTimer={manualImageCaptureTimer}
                        removeCapturedImage={removeCapturedImage}
                    />
                ) : (
                    <DesktopTestView
                        muteAudio={muteAudio}
                        muted={muted}
                        handleDialog={handleDialog}
                        showBCModal={showBCModal}
                        setShowBCModal={setShowBCModal}
                        scanType={scanType}
                        barcodeUploaded={barcodeUploaded}
                        activeStep={activeStep}
                        test={test}
                        showTimer={showTimer}
                        time={time}
                        handleTimerEnd={handleTimerEnd}
                        reCaptureBarcode={reCaptureBarcode}
                        closeBCModal={closeBCModal}
                        setToggleContent={setToggleContent}
                        repeatAudio={repeatAudio}
                        performLabelScan={performLabelScan}
                        handleNextStep={handleNextStep}
                        videoRef={videoRef}
                        isNextDisabled={isNextDisabled}
                        isPrevDisabled={isPlaying}
                        kitName={testingKit.kit_name}
                        videoStream={stream}
                        barcodeIsLoading={barcodeIsLoading}
                        barcodeCapture={barcodeCapture}
                        enterBarcode={openEnterManually}
                        setEnterBarcode={setOpenEnterManually}
                        barcodeValue={barcodeValue}
                        setBarcodeValue={setBarcodeValue}
                        capturedImage={capturedBarcode}
                        setCapturedImage={setCapturedBarcode}
                        faceDetected={faceDetected}
                        capturing={capturing}
                        setCapturing={setCapturing}
                        capturedImageTrigger={capturedImageTrigger}
                        trackImageCapture={trackImageCapture}
                        setTrackImageCapture={setTrackImageCapture}
                        startManualCaptureFn={startTimer}
                        manualImageCaptureTimer={manualImageCaptureTimer}
                        removeCapturedImage={removeCapturedImage}
                    />
                )}

                <audio
                    key={activeStep + 3}
                    id="test-audio"
                    src={
                        hasText(currentStep?.browser_audio!)
                            ? currentStep?.browser_audio
                            : currentStep?.audio_path
                    }
                    controls
                    autoPlay
                    muted={muted}
                    style={{ display: 'none' }}
                />

                <Webcam
                    ref={cameraRef}
                    audio={false}
                    className="test-camera-container"
                    videoConstraints={{
                        facingMode: 'user',
                    }}
                    imageSmoothing={false}
                    style={{
                        visibility: 'hidden',
                        zIndex: -1,
                        position: 'absolute',
                        top: 0,
                    }}
                    mirrored
                />
            </div>
        </>
    );
}
export default Test;
