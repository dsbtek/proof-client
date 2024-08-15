"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import * as ml5 from 'ml5';
import Image from 'next/image';
import Webcam from 'react-webcam';

import { AgreementFooter, AgreementHeader, Button, Loader_ } from '@/components';
import { setIDFront, setExtractedFaceImage } from '@/redux/slices/appConfig';
import { uploadFileToS3 } from './action';
import useFaceMesh from '@/hooks/faceMesh';

const usePermissions = () => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setPermissionsGranted(true);
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                toast.error('Error accessing camera. Please allow camera access to continue.');
            }
        };

        checkPermissions();
    }, []);

    return permissionsGranted;
};

const extractFaceImage = (img: HTMLImageElement, face: any, paddingRatio = 0.5) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    const keypoints = face.scaledMesh;
    const xCoords = keypoints.map((point: number[]) => point[0]);
    const yCoords = keypoints.map((point: number[]) => point[1]);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const paddingX = (maxX - minX) * paddingRatio;
    const paddingY = (maxY - minY) * paddingRatio;

    const startX = Math.max(minX - paddingX, 0);
    const startY = Math.max(minY - paddingY, 0);
    const endX = Math.min(maxX + paddingX, img.width);
    const endY = Math.min(maxY + paddingY, img.height);

    canvas.width = endX - startX;
    canvas.height = endY - startY;
    context.drawImage(img, startX, startY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    // Apply sharpening filter to improve image quality
    // context.filter = 'contrast(1.2) brightness(1.1)'; // Adjust contrast and brightness
    // context.drawImage(canvas, 0, 0);

    return canvas.toDataURL('image/png');
};

const CameraIDCardDetection = () => {


    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [faceImage, setFaceImage] = useState<string | null>(null);
    const [faces, setFaces] = useState<any[]>([]);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [brightness, setBrightness] = useState<number>(0);
    const cameraRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dispatch = useDispatch();

    const permissionsGranted = usePermissions();
    const faceMesh = useFaceMesh();
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

    const checkForFace = useCallback(async () => {
        if (cameraRef.current && faceMesh) {
            const screenshot = cameraRef.current.getScreenshot();
            if (screenshot) {
                const img = new window.Image();
                img.src = screenshot;
                img.onload = async () => {
                    const predictions = await faceMesh.predict(img);
                    setFaces(predictions);
                    setFaceDetected(predictions.length > 0);

                    if (canvasRef.current) {
                        const context = canvasRef.current.getContext('2d');
                        if (context) {
                            canvasRef.current.width = img.width;
                            canvasRef.current.height = img.height;
                            context.drawImage(img, 0, 0, img.width, img.height);
                            const imageData = context.getImageData(0, 0, img.width, img.height);
                            calculateBrightness(imageData);
                        }
                    }
                };
            }
        }
    }, [faceMesh, calculateBrightness]);

    useEffect(() => {
        const interval = setInterval(checkForFace, 1000);
        return () => clearInterval(interval);
    }, [checkForFace]);

    const captureFrame = useCallback(async () => {
        try {
            const imageSrc = cameraRef?.current?.getScreenshot();
            setCapturedImage(imageSrc as any);
            dispatch(setIDFront(imageSrc!));

            if (imageSrc && faceMesh) {
                const img = new window.Image();
                img.src = imageSrc;
                img.onload = async () => {
                    const predictions = await faceMesh.predict(img);
                    const face = predictions[0];
                    if (face) {
                        const faceBase64 = extractFaceImage(img, face);
                        if (faceBase64) {
                            setFaceImage(faceBase64);
                            dispatch(setExtractedFaceImage(faceBase64));
                            await uploadFileToS3(faceBase64, '8554443303-ManualCapture-1712042780.png');
                        } else {
                            toast.error('Error extracting face image.');
                        }
                    } else {
                        toast.error('No face detected. Please try again.');
                    }
                };
            }
        } catch (error) {
            toast.error('Error capturing image. Please try again.');
        }
    }, [cameraRef, dispatch, faceMesh]);

    const recaptureImage = () => {
        setCapturedImage(null);
        setFaceImage(null);
    };

    return (
        <>
            {sigCanvasH !== 700 ?
                <div className="id-detection-container" style={{ position: 'relative' }}>
                    <AgreementHeader title="PIP - Step 1 " />
                    <br />
                    <div className='test-items-wrap-desktop_'>
                        <div className="sub-item">
                            {!capturedImage && <p className="vid-text">Please position the front side of your ID <br />in the camera frame below.</p>}
                        </div>

                        <br />
                        {permissionsGranted ? (
                            !capturedImage ? (
                                <div className='camera-container'>
                                    <Webcam
                                        className='camera'
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        imageSmoothing={true}
                                    />

                                    <div className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"}`}>
                                        {brightness < 120 && (
                                            <div className='brightness-detection'>
                                                <p>Insufficient light detected.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
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
                                        <div className='face-image-wrap'>
                                            <p className="vid-text" style={{ color: '#009cf9', marginBottom: '8px', whiteSpace: 'nowrap' }}>Extracted ID Face</p>
                                            <Image
                                                className='face-image'
                                                src={faceImage}
                                                alt="Extracted Face Image"
                                                layout="responsive"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                    )}
                                    {!faceImage && <Button blue onClick={recaptureImage} style={{ marginTop: '2em' }}>Recapture</Button>}
                                </>
                            )
                        ) : (
                            <>
                                <p className="vid-text">Camera access is not granted. Please allow camera access to continue.</p>
                                <Loader_ />
                            </>
                        )}
                    </div>

                    <br />
                    {capturedImage && (
                        <div>
                            <p className="vid-text">Please tap the `Next` button to move to step 2 <br /> where you will position the rear side of your ID.</p>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <AgreementFooter
                        onPagination={false}
                        onLeftButton={faceImage ? true : false}
                        onRightButton={true}
                        btnLeftText={'Recapture'}
                        onClickBtnLeftAction={faceImage ? recaptureImage : () => { }}
                        btnRightText={capturedImage ? "Next" : "Capture"}
                        onClickBtnRightAction={capturedImage ? undefined : captureFrame}
                        rightdisabled={!faceDetected}
                        btnRightLink={capturedImage ? '/identity-profile/id-detection/step-2' : undefined}
                    />
                </div>
                :
                <div className="id-detection-container_" style={{ position: 'relative' }}>
                    <AgreementHeader title="PROOF Identity Profile (PIP) " />
                    {/* <br /> */}
                    <div className='camera-items-wrap-desktop_'>
                        <div className="sub-item">
                            <h3 className="">PIP - Step 1</h3>
                            <br />
                            {!capturedImage && <p className="">Please position the front side of your ID <br />in the camera frame below.</p>}
                            {faceImage && <p className=""> Please tap the `Next` button to move to step 2 where you will <br /> position the rear side of your ID. in the camera frame below.</p>}

                        </div>

                        {permissionsGranted ? (
                            !capturedImage ? (
                                <div className='camera-container'>
                                    <Webcam
                                        className='camera'
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        imageSmoothing={true}
                                    />

                                    <div className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"}`}>
                                        {brightness < 120 && (
                                            <div className='brightness-detection'>
                                                <p>Insufficient light detected.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="id-img_" style={{ display: "flex", flexDirection: "column" }}>

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
                                            // <div className="id-img_">
                                            <div className='face-image-wrap'>
                                                <p className="vid-text" style={{ color: '#009cf9', marginBottom: '8px', whiteSpace: 'nowrap' }}>Extracted ID Face</p>
                                                <Image
                                                    className='face-image'
                                                    src={faceImage}
                                                    alt="Extracted Face Image"
                                                    layout="responsive"
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>
                                            // </div>

                                        )}
                                    </div>

                                    {!faceImage && <Button blue onClick={recaptureImage} style={{ marginTop: '2em' }}>Recapture</Button>}
                                </>
                            )
                        ) : (
                            <>
                                <p className="vid-text">Camera access is not granted. Please allow camera access to continue.</p>
                                <Loader_ />
                            </>
                        )}
                    </div>

                    <br />
                    {capturedImage && (
                        <div>
                            <p className="vid-text">Please tap the `Next` button to move to step 2 <br /> where you will position the rear side of your ID.</p>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <AgreementFooter
                        onPagination={false}
                        onLeftButton={faceImage ? true : false}
                        onRightButton={true}
                        btnLeftText={'Recapture'}
                        onClickBtnLeftAction={faceImage ? recaptureImage : () => { }}
                        btnRightText={capturedImage ? "Next" : "Capture"}
                        onClickBtnRightAction={capturedImage ? undefined : captureFrame}
                        rightdisabled={!faceDetected}
                        btnRightLink={capturedImage ? '/identity-profile/id-detection/step-2' : undefined}
                    />
                </div>
            }
        </>

    );
};

export default CameraIDCardDetection;
