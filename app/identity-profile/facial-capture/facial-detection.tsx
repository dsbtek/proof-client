'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GrStatusGood } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';

import {
    AgreementFooter,
    AppContainer,
    AppHeader,
    DesktopFooter,
    IdTimer,
    Loader_,
    PipLoader,
    PipStepLoader,
} from '@/components';
import useFaceDetector from '@/hooks/faceDetector';
import {
    IdCardFacialPercentageScoreString,
    idFrontString,
    pageRedirect,
    ReDirectToBac,
    ReDirectToProofPass,
    setFacialCapture,
    setIdCardFacialPercentageScore,
    userIdString,
} from '@/redux/slices/appConfig';
import { authToken } from '@/redux/slices/auth';
import {
    setFaceCompare,
    setFaceScans,
    testingKit,
} from '@/redux/slices/drugTest';
import { compareFacesAI } from '@/utils/queries';
import { uploadImagesToS3 } from '../id-detection/step-1/action';
// import { useCameraPermissions } from "@/hooks/useCameraPermissions";

const FacialCapture = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const faceImage = useSelector(idFrontString);
    const userID = useSelector(userIdString);
    const percentageScoreString = useSelector(
        IdCardFacialPercentageScoreString,
    );
    const reDirectToProofPass = useSelector(ReDirectToProofPass);
    const pageDestination = useSelector(pageRedirect);
    const reDirectToBac = useSelector(ReDirectToBac);
    const { kit_id, Scan_Kit_Label } = useSelector(testingKit);
    const preTestQuestionnaire = useSelector(
        (state: any) => state.preTest.preTestQuestionnaire,
    );
    // const permissionsGranted = useCameraPermissions();
    const { participant_id } = useSelector(authToken);
    const cameraRef = useRef<Webcam | null>(null);
    const [faceDetector, setFaceDetector] = useState<any>(null);
    const [faceCapture, setFaceCapture] = useState<any>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [brightness, setBrightness] = useState<number>(0);
    const [similarity, setSimilarity] = useState(false);
    const [sigCanvasH, setSigCanvasH] = useState(0);
    const [webcamKey, setWebcamKey] = useState(0);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(5);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [mediaError, setMediaError] = useState<any>();
    const { faceDetected } = useFaceDetector(cameraRef);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { kit_name } = useSelector(testingKit);
    const [showCountdown, setShowCountdown] = useState<boolean>(false);

    useEffect(() => {
        const routeBasedOnScreenSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 700) {
                setSigCanvasH(250);
            } else {
                setSigCanvasH(700);
            }
        };
        routeBasedOnScreenSize();
        window.addEventListener('resize', routeBasedOnScreenSize);
        return () =>
            window.removeEventListener('resize', routeBasedOnScreenSize);
    }, []);

    const correctBase64Image = (base64String: string) => {
        return base64String.replace(
            'data:application/octet-stream;',
            'data:image/png;',
        );
    };

    const compareFaces = useCallback(
        async (img1Base64: string, img2Base64: string) => {
            try {
                const similarity = await compareFacesAI(img1Base64, img2Base64);
                if (similarity.status === 'complete') {
                    setSimilarity(true);
                    return `${similarity.result.percentage}`;
                }
                if (
                    similarity.message ===
                    'An error occurred while processing the images'
                ) {
                    setCapturedImage('');
                    toast.error(`${similarity.message}`);
                    setTimeout(() => {
                        router.push('/identity-profile/id-detection/step-1');
                    }, 3000);
                } else if (
                    similarity.message ===
                    'An error occurred while processing the image'
                ) {
                    setCapturedImage('');
                    toast.error(`${similarity.message}`);
                } else if (
                    similarity.message ===
                    'An error occurred while loading the image for face recognition'
                ) {
                    toast.error(`${similarity.message}`);
                    setTimeout(() => {
                        router.push('/identity-profile/id-detection/step-1');
                    }, 3000);
                } else if (
                    similarity.message === 'No faces found in the first image'
                ) {
                    toast.error(`${similarity.message}`);
                    setTimeout(() => {
                        router.push('/identity-profile/id-detection/step-1');
                    }, 3000);
                } else if (
                    similarity.message === 'No faces found in the second image'
                ) {
                    setCapturedImage('');
                    toast.error(`${similarity.message}`);
                }
            } catch (error) {
                toast.error('Unable to  perform facial scan');
            }
        },
        [router],
    );
    const compareCapturedImage = useCallback(
        async (img1Base64: string, img2Base64: string) => {
            try {
                const correctedBase64 = correctBase64Image(img2Base64 as any);
                setIsVisible(true);
                const similarityScore = await compareFaces(
                    correctedBase64.replace(/^data:image\/\w+;base64,/, ''),
                    img1Base64.replace(/^data:image\/\w+;base64,/, ''),
                );
                dispatch(
                    setFaceScans({ percentage: similarityScore as string }),
                );
                console.log(similarityScore);
                setIsVisible(false);
                if (similarityScore) setLoaderVisible(true);
                dispatch(setIdCardFacialPercentageScore(similarityScore));
            } catch (error) {
                console.error('Compare Faces Error:', error);
                toast.error('Error Comparing Faces');
            }
        },
        [compareFaces, dispatch],
    );

    const captureFrame = useCallback(async () => {
        try {
            const imageSrc = cameraRef?.current?.getScreenshot();
            const facialCapture = `${participant_id}-FacialCapture-${Date.now()}.png`;
            setCapturedImage(imageSrc!);
            setFaceCapture(imageSrc!);
            dispatch(setFacialCapture(imageSrc!));
            dispatch(setFaceCompare(facialCapture));
            uploadImagesToS3(imageSrc!, facialCapture).catch((error) => {
                console.error('Facial Capture Upload Error:', error);
            });

            console.log('face img: ', faceImage, userID);

            const imageToCompare = faceImage ? faceImage : userID;
            compareCapturedImage(imageSrc!, imageToCompare as string);
        } catch (error) {
            toast.error('Error capturing image. Please try again.');
        }
        setShowTimer(false);
    }, [compareCapturedImage, dispatch, faceImage, participant_id, userID]);

    const startTimer = (timeLimit: number) => {
        setShowTimer(true);
        setShowCountdown(true);
        setTimeLeft(timeLimit);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        timerIntervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const updatedTime = prev - 1;
                if (updatedTime <= 0) {
                    clearInterval(timerIntervalRef.current as NodeJS.Timeout);
                    captureFrame();
                    setShowCountdown(false);
                }
                return updatedTime;
            });
        }, 1000);
    };
    // const pathLink = (): string => {
    //   try {
    //     if (reDirectToProofPass) {
    //       return "/proof-pass/proof-pass-upload";
    //     } else if (reDirectToBac) {
    //       return "/bac";
    //     } else if (Scan_Kit_Label) {
    //       return "/test-collection/scan-package-barcode";
    //     } else if (preTestQuestionnaire && preTestQuestionnaire?.length > 0) {
    //       return "/pre-test-questions";
    //     } else return `/test-collection/${kit_id}`;
    //   } catch (error) {
    //     toast.error(`Error: ${error}`);
    //     return `Error: ${error}`;
    //   }
    // };

    const pathLink = (): string => {
        let destination = pageDestination?.page;
        try {
            if (destination === '/bac') {
                return '/bac';
            } else if (destination === '/proof-pass/proof-pass-upload') {
                return '/proof-pass/proof-pass-upload';
            } else if (Scan_Kit_Label) {
                return '/test-collection/scan-package-barcode';
            } else if (
                preTestQuestionnaire &&
                preTestQuestionnaire?.length > 0
            ) {
                return '/pre-test-questions';
            } else return `/test-collection/clear-view`;
        } catch (error) {
            toast.error(`Error: ${error}`);
            return `Error: ${error}`;
        }
    };
    const recapture = () => {
        setCapturedImage('');
        dispatch(setIdCardFacialPercentageScore(''));
    };

    const frameStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
    };

    useEffect(() => {
        return () => {
            if (cameraRef.current) {
                const stream = cameraRef.current.stream;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach((track) => track.stop());
                }
            }
        };
    }, []);

    const handleLoaderClose = () => {
        setLoaderVisible(false);
    };

    return (
        <>
            <PipLoader pipStep={2} isVisible={isVisible} />
            <PipStepLoader
                pipStep={3}
                isVisible={isLoaderVisible}
                onClose={handleLoaderClose}
            />
            <AppContainer
                header={<AppHeader title="PIP - Step 3" hasMute={false} />}
                body={
                    sigCanvasH !== 700 ? (
                        <>
                            {!capturedImage && (
                                <p className="vid-text">
                                    Please position your head and body in the
                                    silhouette you see on screen. Please be as
                                    still as possible and look directly at the
                                    screen.
                                </p>
                            )}
                            <br />
                            {!capturedImage ? (
                                <div className="camera-container">
                                    {/* {permissionsGranted.permissionsGranted && ( */}
                                    <Webcam
                                        className="camera"
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        videoConstraints={{
                                            facingMode: 'user',
                                        }}
                                        imageSmoothing={true}
                                        mirrored
                                        onUserMediaError={(error) => {
                                            console.error(
                                                'Camera error:',
                                                error,
                                            );
                                            setMediaError(error);
                                            toast.error(
                                                'Camera access denied. Please check your settings.',
                                            );
                                        }}
                                    />
                                    {showTimer && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                zIndex: 999,
                                            }}
                                        >
                                            {/* <IdTimer timeLeft={timeLeft} /> */}
                                        </div>
                                    )}
                                    <div style={frameStyle as any}>
                                        {faceDetected ? (
                                            <Image
                                                className="detection-image"
                                                src="/images/face-detected-green.png"
                                                alt="captured Image"
                                                width={2000}
                                                height={2000}
                                            />
                                        ) : (
                                            <Image
                                                className="detection-image"
                                                src="/images/face-no-detected-red.png"
                                                alt="captured Image"
                                                width={2000}
                                                height={2000}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="scan-complete-wrap">
                                    <div className="image-container">
                                        <Image
                                            className="captured-image"
                                            src={capturedImage}
                                            alt="captured Image"
                                            width={5000}
                                            height={5000}
                                            loading="lazy"
                                        />
                                    </div>
                                    {similarity ? (
                                        // {percentageScoreString ? (
                                        <div className="image-container">
                                            <div className="scan-complete">
                                                <GrStatusGood
                                                    color="#32de84"
                                                    size={30}
                                                />
                                                <p>Scan Complete!</p>
                                            </div>
                                            <p style={{ textAlign: 'center' }}>
                                                Your PROOF Identity Profile has
                                                been successfully established.
                                                <br />
                                                <br />
                                                Click `Next` to Continue
                                            </p>
                                        </div>
                                    ) : (
                                        <Loader_ />
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="id-detection-container_">
                            {/* <AgreementHeader
              title="PROOF Identity Profile (PIP)"
                hasMute={false} /> */}
                            <div className="test-items-wrap-desktop_">
                                {!capturedImage && (
                                    <div className="sub-item">
                                        <div style={{ minHeight: '10px' }}>
                                            <h3 className="">PIP - Step 3</h3>
                                            <br />
                                            <p className="">
                                                Please position your head and
                                                body in the silhouette you see
                                                on screen. Please be as still as
                                                possible and look directly at
                                                the screen.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!capturedImage ? (
                                    <div className="camera-container">
                                        <Webcam
                                            className="camera"
                                            ref={cameraRef}
                                            audio={false}
                                            screenshotFormat="image/png"
                                            videoConstraints={{
                                                facingMode: 'user',
                                            }}
                                            imageSmoothing={true}
                                            mirrored
                                        />
                                        {showTimer && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    zIndex: 999,
                                                }}
                                            >
                                                {/* <IdTimer timeLeft={timeLeft} /> */}
                                            </div>
                                        )}
                                        <div style={frameStyle as any}>
                                            {faceDetected ? (
                                                <Image
                                                    className="detection-image"
                                                    src="/images/face-detected-green.png"
                                                    alt="captured Image"
                                                    width={2000}
                                                    height={2000}
                                                />
                                            ) : (
                                                <Image
                                                    className="detection-image"
                                                    src="/images/face-no-detected-red.png"
                                                    alt="captured Image"
                                                    width={2000}
                                                    height={2000}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="scan-complete-wrap">
                                        {similarity && (
                                            <div className="scan-complete">
                                                <GrStatusGood
                                                    color="#32de84"
                                                    size={30}
                                                />
                                                <p>Scan Complete!</p>
                                            </div>
                                        )}
                                        <div className="image-container">
                                            <Image
                                                className="captured-image"
                                                src={capturedImage}
                                                alt="captured Image"
                                                width={5000}
                                                height={5000}
                                                loading="lazy"
                                            />
                                        </div>
                                        {similarity ? (
                                            // {percentageScoreString ? (
                                            <div className="image-container">
                                                <p
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Your PROOF Identity Profile
                                                    has been successfully
                                                    established.
                                                    <br />
                                                    <br />
                                                    Click `Next` to Continue
                                                </p>
                                            </div>
                                        ) : (
                                            <Loader_ />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
                footer={
                    sigCanvasH != 700 ? (
                        capturedImage ? (
                            <AgreementFooter
                                currentNumber={2}
                                outOf={4}
                                onPagination={false}
                                onLeftButton={true}
                                onRightButton={true}
                                btnLeftLink={''}
                                btnRightLink={
                                    kit_name ===
                                    '2SAN Home Drug Test Collection & Result Recording'
                                        ? '/pre-test-questions/ready-for-test-2san'
                                        : pathLink()
                                }
                                btnLeftText={capturedImage ? 'Recapture' : ''}
                                btnRightText={
                                    showCountdown && timeLeft > 0
                                        ? `${timeLeft}`
                                        : 'Next'
                                }
                                rightdisabled={!similarity}
                                onClickBtnLeftAction={
                                    capturedImage ? recapture : () => {}
                                }
                            />
                        ) : (
                            <AgreementFooter
                                currentNumber={2}
                                outOf={4}
                                onPagination={false}
                                onLeftButton={false}
                                onRightButton={true}
                                btnLeftLink={''}
                                btnRightLink={''}
                                btnLeftText={'Clear'}
                                btnRightText={
                                    showCountdown && timeLeft > 0
                                        ? `${timeLeft}`
                                        : 'Capture'
                                }
                                onClickBtnRightAction={() => startTimer(5)}
                                rightdisabled={!faceDetected}
                            />
                        )
                    ) : capturedImage ? (
                        <DesktopFooter
                            currentNumber={2}
                            outOf={4}
                            onPagination={false}
                            onLeftButton={true}
                            onRightButton={true}
                            btnLeftLink={''}
                            btnRightLink={
                                kit_name ===
                                '2SAN Home Drug Test Collection & Result Recording'
                                    ? '/pre-test-questions/ready-for-test-2san'
                                    : pathLink()
                            }
                            btnLeftText={capturedImage ? 'Recapture' : ''}
                            btnRightText={
                                showCountdown && timeLeft > 0
                                    ? `${timeLeft}`
                                    : 'Next'
                            }
                            rightdisabled={!similarity}
                            onClickBtnLeftAction={
                                capturedImage ? recapture : () => {}
                            }
                        />
                    ) : (
                        <DesktopFooter
                            currentNumber={2}
                            outOf={4}
                            onPagination={false}
                            onLeftButton={false}
                            onRightButton={true}
                            btnLeftLink={''}
                            btnRightLink={''}
                            btnLeftText={'Clear'}
                            btnRightText={
                                showCountdown && timeLeft > 0
                                    ? `${timeLeft}`
                                    : 'Capture'
                            }
                            onClickBtnRightAction={() => startTimer(5)}
                            rightdisabled={!faceDetected}
                        />
                    )
                }
            />
        </>
    );
};
export default FacialCapture;
