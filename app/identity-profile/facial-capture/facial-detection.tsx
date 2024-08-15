"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { GrStatusGood } from "react-icons/gr";
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import * as ml5 from 'ml5';

import { AgreementFooter, AgreementHeader, Loader_ } from '@/components';
import {
    appData,
    setIdCardFacialPercentageScore,
    IdCardFacialPercentageScoreString,
    extractedFaceImageString,
    idFrontString,
    ReDirectToProofPass,
    ReDirectToBac,
    userIdString,
    setFacialCapture
} from '@/redux/slices/appConfig';
import { testingKit } from '@/redux/slices/drugTest';
import { uploadFileToS3 } from '../id-detection/step-1/action';
import { compareFacesAI } from '@/utils/queries';
import useFaceDetector from '@/hooks/faceDetector';

const FacialCapture = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const faceImage = useSelector(idFrontString);
    const userID = useSelector(userIdString);
    const percentageScoreString = useSelector(IdCardFacialPercentageScoreString);
    const reDirectToProofPass = useSelector(ReDirectToProofPass);
    const reDirectToBac = useSelector(ReDirectToBac);
    const { kit_id } = useSelector(testingKit);
    const preTestQuestionnaire = useSelector((state: any) => state.preTest.preTestQuestionnaire);
    const cameraRef = useRef<Webcam | null>(null);
    const [faceDetector, setFaceDetector] = useState<any>(null);
    const [faceCapture, setFaceCapture] = useState<any>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [brightness, setBrightness] = useState<number>(0);

    const { faceDetected } = useFaceDetector(cameraRef)
    const [similarity, setSimilarity] = useState(false);
    const [sigCanvasH, setSigCanvasH] = useState(0);

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
        return () => window.removeEventListener('resize', routeBasedOnScreenSize);
    }, []);
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                toast.error('Error accessing camera. Please allow camera access to continue.');
            }
        };

        checkPermissions();

    }, []);

    const calculateBrightness = useCallback((imageData: { data: any; }) => {
        const data = imageData.data;
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
        }

        const averageBrightness = totalBrightness / (data.length / 4);
        setBrightness(averageBrightness);
    }, []);

    const correctBase64Image = (base64String: string) => {
        return base64String.replace('data:application/octet-stream;', 'data:image/png;');
    };

    const compareFaces = useCallback(async (img1Base64: string, img2Base64: string) => {
        try {
            const similarity = await compareFacesAI(img1Base64, img2Base64);
            if (similarity.status === 'complete') {
                setSimilarity(true);
                return `${similarity.result.percentage}%`;
            };
            if (similarity.message === 'An error occurred while processing the images') {
                setCapturedImage("")
                toast.error(`${similarity.message}`);
                setTimeout(() => {
                    router.push('/identity-profile/id-detection/step-1');
                }, 3000);
            } else if (similarity.message === 'An error occurred while processing the image') {
                setCapturedImage("")
                toast.error(`${similarity.message}`);
            } else if (similarity.message === 'An error occurred while loading the image for face recognition') {
                toast.error(`${similarity.message}`);
                setTimeout(() => {
                    router.push('/identity-profile/id-detection/step-1');
                }, 3000);
            } else if (similarity.message === 'No faces found in the first image') {
                toast.error(`${similarity.message}`);
                setTimeout(() => {
                    router.push('/identity-profile/id-detection/step-1');
                }, 3000);
            } else if (similarity.message === 'No faces found in the second image') {
                setCapturedImage("")
                toast.error(`${similarity.message}`);
            };
        } catch (error) {
            toast.error('Unable to  perform facial scan');
        }
    }, [router]);

    const captureFrame = useCallback(async () => {
        try {
            const imageSrc = cameraRef?.current?.getScreenshot();
            setCapturedImage(imageSrc!);
            setFaceCapture(imageSrc!);
            dispatch(setFacialCapture(imageSrc!));
            uploadFileToS3(imageSrc!, '8554443303-FacialCapture.png').catch((error) => {
                console.error('Facial Capture Upload Error:', error);
            });
        } catch (error) {
            toast.error('Error capturing image. Please try again.');
        }
    }, [dispatch]);

    useEffect(() => {
        const compareCapturedImage = async () => {
            if (faceCapture) {
                const imageToCompare = faceImage || userID;
                const correctedBase64 = correctBase64Image(imageToCompare as any);
                const similarityScore = await compareFaces(correctedBase64.replace(/^data:image\/\w+;base64,/, ''), faceCapture.replace(/^data:image\/\w+;base64,/, ''));
                dispatch(setIdCardFacialPercentageScore(similarityScore));
            }
        };
        compareCapturedImage();
    }, [capturedImage, modelsLoaded, faceCapture, dispatch, faceImage, userID, compareFaces]);

    const pathLink = (): string => {
        try {
            if (reDirectToProofPass) {
                return "/proof-pass/proof-pass-upload";
            } else if (reDirectToBac) {
                return "/bac";
            } else if (preTestQuestionnaire && preTestQuestionnaire?.length > 0) {
                return "/pre-test-questions";
            } else return `/test-collection/${kit_id}`
        } catch (error) {
            toast.error(`Error: ${error}`)
            return `Error: ${error}`
        }

    };

    const recapture = () => {
        setCapturedImage('')
        dispatch(setIdCardFacialPercentageScore(''));
    }

    const frameStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
    };

    return (
        <>
            {sigCanvasH !== 700 ?
                <div className="container">
                    <AgreementHeader title='PIP - Step 3' />
                    <br />
                    {!capturedImage && (
                        <p className="vid-text">
                            Please position your head and body in the silhouette you see on screen. Please be as still as possible and look directly at the screen.
                        </p>
                    )}
                    <br />
                    {!capturedImage ? (
                        <div className='camera-container'>
                            <Webcam
                                className='camera'
                                ref={cameraRef}
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={{ facingMode: "user" }}
                                imageSmoothing={true}
                            />
                            <div style={frameStyle as any}>
                                {faceDetected ?
                                    <Image className="detection-image" src="/images/face-detected.png" alt="captured Image" width={2000} height={2000} />
                                    :
                                    <Image className="detection-image" src="/images/face-no-detected.png" alt="captured Image" width={2000} height={2000} />
                                }
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="image-container">
                                <Image className="captured-image" src={capturedImage} alt="captured Image" width={5000} height={5000} loading="lazy" />
                            </div>
                            {similarity ? (
                                // {percentageScoreString ? (
                                <div className="image-container">
                                    <div className="scan-complete">
                                        <GrStatusGood color='#32de84' size={30} />
                                        <p>Scan Complete!</p>
                                    </div>
                                    <p style={{ textAlign: 'center' }}>
                                        Your PROOF Identity Profile has been successfully established.
                                        <br /><br />
                                        Click `Next` to Continue
                                    </p>
                                </div>
                            ) : (
                                <Loader_ />
                            )}
                        </>
                    )}
                    {capturedImage ? (
                        <AgreementFooter
                            currentNumber={2}
                            outOf={4}
                            onPagination={false}
                            onLeftButton={true}
                            onRightButton={true}
                            btnLeftLink={""}
                            btnRightLink={pathLink()}
                            btnLeftText={capturedImage ? "Recapture" : ""}
                            btnRightText={"Next"}
                            rightdisabled={!similarity}
                            onClickBtnLeftAction={capturedImage ? recapture : () => { }}
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
                            btnRightText={'Capture'}
                            onClickBtnRightAction={captureFrame}
                            rightdisabled={!faceDetected}
                        />
                    )}
                </div>
                :
                <div className="id-detection-container_">
                    <AgreementHeader title='PROOF Identity Profile (PIP)' />
                    <div className='test-items-wrap-desktop_'>

                        {!capturedImage && (
                            <div className="sub-item">
                                <h3 className="">PIP - Step 3</h3>
                                <br />
                                <p className="">
                                    Please position your head and body in the silhouette you see on screen. Please be as still as possible and look directly at the screen.
                                </p>
                            </div>

                        )}

                        {!capturedImage ? (
                            <div className='camera-container'>
                                <Webcam
                                    className='camera'
                                    ref={cameraRef}
                                    audio={false}
                                    screenshotFormat="image/png"
                                    videoConstraints={{ facingMode: "user" }}
                                    imageSmoothing={true}
                                />
                                <div style={frameStyle as any}>
                                    {faceDetected ?
                                        <Image className="detection-image" src="/images/face-detected.png" alt="captured Image" width={2000} height={2000} />
                                        :
                                        <Image className="detection-image" src="/images/face-no-detected.png" alt="captured Image" width={2000} height={2000} />
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className='scan-complete-wrap'>
                                {similarity &&
                                    <div className="scan-complete">
                                        <GrStatusGood color='#32de84' size={30} />
                                        <p>Scan Complete!</p>
                                    </div>
                                }
                                <div className="image-container">
                                    <Image className="captured-image" src={capturedImage} alt="captured Image" width={5000} height={5000} loading="lazy" />
                                </div>
                                {similarity ? (
                                    // {percentageScoreString ? (
                                    <div className="image-container">

                                        <p style={{ textAlign: 'center' }}>
                                            Your PROOF Identity Profile has been successfully established.
                                            <br /><br />
                                            Click `Next` to Continue
                                        </p>
                                    </div>
                                ) : (
                                    <Loader_ />
                                )}

                            </div>
                        )}
                    </div>
                    {capturedImage ? (
                        <AgreementFooter
                            currentNumber={2}
                            outOf={4}
                            onPagination={false}
                            onLeftButton={true}
                            onRightButton={true}
                            btnLeftLink={""}
                            btnRightLink={pathLink()}
                            btnLeftText={capturedImage ? "Recapture" : ""}
                            btnRightText={"Next"}
                            rightdisabled={!similarity}
                            onClickBtnLeftAction={capturedImage ? recapture : () => { }}
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
                            btnRightText={'Capture'}
                            onClickBtnRightAction={captureFrame}
                            rightdisabled={!faceDetected}
                        />
                    )}
                </div>
            }
        </>
    );
};

export default FacialCapture;