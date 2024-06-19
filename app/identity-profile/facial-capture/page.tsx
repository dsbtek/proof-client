"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { GrStatusGood } from "react-icons/gr";
import * as faceapi from 'face-api.js';
import { AgreementFooter, AgreementHeader, Loader_ } from '@/components';
import { appData, setIdCardFacialPercentageScore, IdCardFacialPercentageScoreString, extractedFaceImageString, idFrontString, ReDirectToProofPass, userIdString } from '@/redux/slices/appConfig';
import { testingKit } from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';

const FacialCapture = () => {
    const router = useRouter();
    const faceImage = useSelector(idFrontString);
    const extractedFaceImage = useSelector(extractedFaceImageString);
    const userID = useSelector(userIdString);
    const percentageScoreString = useSelector(IdCardFacialPercentageScoreString);
    const reDirectToProofPass = useSelector(ReDirectToProofPass);
    const { kit_id } = useSelector(testingKit);
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const user = useSelector(appData);
    const photo = user?.userId

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            setModelsLoaded(true);
        };
        loadModels();
    }, []);

    const checkForFace = useCallback(async () => {
        if (cameraRef.current && modelsLoaded) {
            const screenshot = cameraRef.current.getScreenshot();
            if (screenshot) {
                const img = await faceapi.fetchImage(screenshot);
                const detections = await faceapi.detectSingleFace(img);
                setFaceDetected(!!detections);
            }
        }
    }, [modelsLoaded]);

    useEffect(() => {
        const interval = setInterval(checkForFace, 1000); // Check for face every second
        return () => clearInterval(interval);
    }, [checkForFace]);

    function correctBase64Image(base64String: string) {
        // Replace 'application/octet-stream' with 'image/png'
        return base64String.replace('data:application/octet-stream;', 'data:image/png;');
    }

    const compareFaces = async (img1Base64: any, img2Base64: string) => {

        const img1 = await faceapi.fetchImage(img1Base64);
        const img2 = await faceapi.fetchImage(img2Base64);

        const detections1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
        const detections2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();
        if (detections1 && detections2) {
            const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor);
            const similarity = ((1 - distance) * 100).toFixed(2);
            console.log(`${similarity}%`, 'similarity')
            return `${similarity}%`;
        } else {
            // setCapturedImage(null)
            toast.error('Face not detected in one or both images, Please re-capture both.');
            setTimeout(() => {
                router.push('/identity-profile/id-detection/step-1');
            }, 3000);
        }
    };

    const captureFrame = useCallback(async () => {
        try {
            const facialCaptureBase64 = cameraRef.current!.getScreenshot();
            setCapturedImage(facialCaptureBase64);
            dispatch(setIdCardFacialPercentageScore(''));
            if (!faceImage && !userID) {
                setCapturedImage(null)
                toast.info('You need to capture your ID card first')
            }
            if ((faceImage || userID) && facialCaptureBase64 && modelsLoaded) {
                try {
                    const imageToCompare = faceImage ? faceImage : userID;
                    const correctedBase64 = correctBase64Image(imageToCompare as any);
                    const similarityScore = await compareFaces(correctedBase64, facialCaptureBase64);
                    dispatch(setIdCardFacialPercentageScore(similarityScore));
                } catch (error) {
                    setCapturedImage(null)
                    console.error("Error comparing faces:", error);
                    toast.error('Error capturing frame. Please re-capture');
                }
            }
        } catch (error) {
            toast.error('Error capturing frame. Please try again.');
        }
    }, [dispatch, faceImage, modelsLoaded, userID]);

    const frameStyle = {
        border: faceDetected ? '5px solid green' : '5px solid red',
        borderRadius: '10px',
        width: '80%',
        height: '200px',
        position: 'absolute',
    };

    return (
        <div className="container">
            <AgreementHeader title='PIP - Step 3' />
            <br />
            {!capturedImage && (
                <p className="vid-text">
                    Please position your head and body in the silhouette you see on screen. Please be as still as possible and look directly at the screen.
                </p>
            )}
            {/* <div className="vid-items-wrap" style={frameStyle}> */}
            <br />
            {!capturedImage ? (
                <div className='camera-container'>
                    <Webcam
                        className='camera'
                        ref={cameraRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={{
                            facingMode: "user"
                        }}
                        imageSmoothing={true}
                    />
                    <div style={frameStyle as any}>
                    </div>
                </div>
            ) : (
                <>
                    <div className="image-container">
                        <Image className="captured-image" src={capturedImage} alt="captured Image" width={5000} height={5000} loading="lazy" />
                    </div>
                    {percentageScoreString ?
                        <div className="image-container">
                            <div className="scan-complete">
                                <GrStatusGood color='#009CF9' size={30} />
                                <p>Scan Complete!</p>
                            </div>

                            <p style={{ textAlign: 'center' }}>
                                Your PROOF Identity Profile has been successfully established.
                                <br /> <br />

                                Click `Next` to Continue
                            </p>
                        </div>
                        :
                        <Loader_ />
                    }
                </>
            )}
            {/* </div> */}
            {capturedImage ? (
                <AgreementFooter
                    currentNumber={2}
                    outOf={4}
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    btnLeftLink={""}
                    btnRightLink={reDirectToProofPass ? `/proof-pass/proof-pass-upload` : `/test-collection/${kit_id}`}
                    btnLeftText={"Decline"}
                    btnRightText={"Next"}
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
    );
};

export default FacialCapture;
