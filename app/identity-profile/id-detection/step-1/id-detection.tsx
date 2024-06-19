"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import * as ml5 from 'ml5';
import Image from 'next/image';
import Webcam from 'react-webcam';

import { AgreementFooter, AgreementHeader, Button } from '@/components';
import { setIDFront, setExtractedFaceImage } from '@/redux/slices/appConfig';
import { uploadFileToS3 } from './action';

const CameraIDCardDetection = () => {
    const [capturedImage, setCapturedImage] = useState<string | null | undefined>(null);
    const [faceImage, setFaceImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [faceDetector, setFaceDetector] = useState<any>(null);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const cameraRef = useRef<Webcam | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setPermissionsGranted(true);
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                toast.error('Error accessing camera. Please allow camera access to continue.');
                console.error('Error accessing camera:', error);
            }
        };

        checkPermissions();

        // Load the face detector model
        const loadFaceDetector = async () => {
            const detector = await ml5.objectDetector('cocossd');
            setFaceDetector(detector);
        };
        loadFaceDetector();
    }, []);

    const checkForFace = useCallback(async () => {
        if (cameraRef.current && faceDetector) {
            const screenshot = cameraRef.current.getScreenshot();
            if (screenshot) {
                const img = new window.Image();
                img.src = screenshot;
                img.onload = () => {
                    faceDetector.detect(img, (err: any, results: any[]) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const face = results.find((obj: { label: string; }) => obj.label === 'person');
                        setFaceDetected(!!face);
                    });
                };
            }
        }
    }, [faceDetector]);

    useEffect(() => {
        const interval = setInterval(checkForFace, 1000);
        return () => clearInterval(interval);
    }, [checkForFace]);

    const captureFrame = useCallback(async () => {
        try {
            const imageSrc = cameraRef?.current?.getScreenshot();
            setCapturedImage(imageSrc);
            dispatch(setIDFront(imageSrc! as any));

            if (imageSrc && faceDetector) {
                const img = new window.Image();
                img.src = imageSrc;
                img.onload = () => {
                    faceDetector.detect(img, (err: any, results: any[]) => {
                        if (err) {
                            console.error(err);
                            toast.error('Error detecting face.');
                            return;
                        }
                        const face = results.find((obj: { label: string; }) => obj.label === 'person');
                        if (face) {
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            if (context) {
                                canvas.width = face.width;
                                canvas.height = face.height;
                                context.drawImage(img, face.x, face.y, face.width, face.height, 0, 0, face.width, face.height);
                                const faceBase64 = canvas.toDataURL('image/png');
                                setFaceImage(faceBase64);
                                dispatch(setExtractedFaceImage(faceBase64));
                                uploadFileToS3(faceBase64, '8554443303-ManualCapture-1712042780.png').catch((error) => { console.error(error) });
                            }
                        } else {
                            toast.error('No face detected. Please try again.');
                        }
                    });
                };
                imageRef.current = img;
            }
        } catch (error) {
            toast.error('Error capturing image. Please try again.');
            console.error(error);
        }
    }, [cameraRef, dispatch, faceDetector]);

    const recaptureImage = () => {
        setCapturedImage(null);
        setFaceImage(null);
    };

    const frameStyle = {
        border: faceDetected ? '5px solid green' : '5px solid red',
        borderRadius: '10px',
        width: '80%',
        height: '200px',
        position: 'absolute',
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            <AgreementHeader title="PIP - Step 1 " />
            <br />
            {!capturedImage &&
                <p className="vid-text">
                    Please position the front side of your ID <br />
                    in the camera frame below.
                </p>
            }
            <br />
            {permissionsGranted ? (
                !capturedImage ?
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
                    :
                    <>
                        {capturedImage && (
                            <div className='id-image'>
                                <Image
                                    className='img-border'
                                    src={capturedImage}
                                    alt="Captured Image"
                                    layout="responsive"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        )}
                        {faceImage && (
                            <div className='face-image'>
                                <Image
                                    className='img-border'
                                    src={faceImage}
                                    alt="Extracted Face Image"
                                    layout="responsive"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        )}
                        {!faceImage && (
                            <Button blue onClick={recaptureImage} style={{ marginTop: '2em' }}>Recapture</Button>
                        )}
                    </>
            ) : (
                <p className="vid-text">Camera access is not granted. Please allow camera access to continue.</p>
            )}
            <br />
            {capturedImage &&
                <div>
                    <p className="vid-text">
                        Please tap the `Next` button to move to step 2 <br /> where you will position the rear side of your ID.
                    </p>
                </div>
            }
            {/* </div> */}
            {capturedImage ?
                <AgreementFooter
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    btnRightLink={'/identity-profile/id-detection/step-2'}
                    btnRightText={"Next"}
                />
                :
                <AgreementFooter
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    btnRightText={"Capture"}
                    onClickBtnRightAction={captureFrame}
                    rightdisabled={!faceDetected}
                />
            }
        </div>
    );
};

export default CameraIDCardDetection;
