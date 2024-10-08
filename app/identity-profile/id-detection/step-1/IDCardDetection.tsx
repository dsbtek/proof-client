"use client";
import { useState, useRef, useCallback, useEffect, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as ml5 from "ml5";
import Image from "next/image";
import Webcam from "react-webcam";
import useResponsive from "@/hooks/useResponsive";
import {
    AgreementFooter,
    AgreementHeader,
    Loader,
    Loader_,
} from "@/components";
import { setIDFront, setExtractedFaceImage } from "@/redux/slices/appConfig";
import { uploadFileToS3 } from "./action";
import useFaceMesh from "@/hooks/faceMesh";
import { drawBoundingBox, extractFaceImage } from "@/utils/utils";
import { authToken } from "@/redux/slices/auth";
import {
    setGovernmentID,
    setPassport,
    setProofID,
} from "@/redux/slices/drugTest";

// Hook to check camera permissions
const usePermissions = () => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setPermissionsGranted(true);
                stream.getTracks().forEach((track) => track.stop());
            } catch {
                toast.error("Error accessing camera. Please allow camera access.");
            }
        };
        checkPermissions();
    }, []);

    return permissionsGranted;
};

const CameraIDCardDetection = () => {
    const dispatch = useDispatch();
    const { participant_id } = useSelector(authToken);

    const [sigCanvasHeight, setSigCanvasHeight] = useState(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [faceImage, setFaceImage] = useState<string | null>(null);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [isExtractingFace, setIsExtractingFace] = useState<boolean>(false);
    const [countdown, setCountdown] = useState(50);
    const [drawBondingBox, setDrawBondingBox] = useState<boolean>(false);
    const cameraRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const faceMesh = useFaceMesh();
    const permissionsGranted = usePermissions();
    const isDesktop = useResponsive();

    // Adjust canvas height based on screen size
    useEffect(() => {
        const adjustCanvasHeight = () => {
            const screenWidth = window.innerWidth;
            setSigCanvasHeight(screenWidth <= 700 ? 250 : 700);
        };
        adjustCanvasHeight();
        window.addEventListener("resize", adjustCanvasHeight);
        return () => window.removeEventListener("resize", adjustCanvasHeight);
    }, []);

    // Function to capture face image
    const captureFaceImage = useCallback(
        (face: any, img: HTMLImageElement, screenshot: SetStateAction<string | null>) => {
            const faceBase64 = extractFaceImage(img, face);
            if (faceBase64) {
                setFaceImage(faceBase64);
                dispatch(setExtractedFaceImage(faceBase64));

                const passportCapture = `${participant_id}-PassportCapture-${Date.now()}.png`;
                const proofId = passportCapture.split(".")[0];
                dispatch(setPassport(passportCapture));
                dispatch(setProofID(proofId));
            }
            setCapturedImage(screenshot);
        },
        [dispatch, participant_id]
    );

    // Check for face detection using the FaceMesh model
    const checkForFace = useCallback(async () => {
        if (!cameraRef.current || !faceMesh) return;
        try {
            const screenshot = drawBoundingBox(canvasRef, cameraRef.current.video, { x: 0.1, y: 0.1, width: 0.8, height: 0.5 }, drawBondingBox);
            if (!screenshot) return;

            const img = new window.Image();
            img.src = screenshot;

            img.onload = async () => {
                const predictions = await faceMesh.predict(img);
                if (predictions.length > 0) {
                    setFaceDetected(true);
                    captureFaceImage(predictions[0], img, screenshot);
                } else {
                    setFaceDetected(false);
                }
            };
        } catch (error) {
            console.error("Face detection error:", error);
            setIsExtractingFace(false);
        }
    }, [faceMesh, captureFaceImage]);

    // Countdown timer to steady the hand
    const startCountdown = useCallback((onComplete: () => void) => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // Handle frame capture and image upload to S3
    const captureFrame = useCallback(async () => {
        try {
            const imageSrc = cameraRef.current?.getScreenshot();
            const idCapture = `${participant_id}-IDCapture-${Date.now()}.png`;

            setCapturedImage(imageSrc || null);
            setIsExtractingFace(true);
            dispatch(setGovernmentID(idCapture));
            dispatch(setIDFront(imageSrc!));
            await uploadFileToS3(imageSrc!, idCapture);

            if (imageSrc && faceMesh) {
                const img = new window.Image();
                img.src = imageSrc;
                img.onload = async () => {
                    const predictions = await faceMesh.predict(img);
                    if (predictions.length > 0) {
                        captureFaceImage(predictions[0], img, imageSrc);
                    } else {
                        toast.error("No face detected. Try again.");
                        setIsExtractingFace(false);
                    }
                };
            }
        } catch (error) {
            toast.error("Error capturing image. Try again.");
            setIsExtractingFace(false);
        }
    }, [dispatch, faceMesh, participant_id, captureFaceImage]);

    const recaptureImage = () => {
        setCapturedImage(null);
        setFaceImage(null);
        setCountdown(1000);
    };

    useEffect(() => {
        checkForFace();
    }, [checkForFace]);

    return (
        <div className="id-detection-container" style={{ position: "relative" }}>
            <AgreementHeader title="PIP - Step 1" />
            <br />
            <div className="test-items-wrap-desktop_">
                {!capturedImage ? (
                    <p className="vid-text">
                        Please position the front side of your ID in the camera frame below.
                    </p>
                ) : (
                    faceImage && (
                        <p className="vid-text">
                            Tap the `Next` button to position the rear side of your ID.
                        </p>
                    )
                )}

                {permissionsGranted ? (
                    !capturedImage ? (
                        <div className="camera-container">
                            <Webcam
                                ref={cameraRef}
                                audio={false}
                                screenshotFormat="image/png"
                                imageSmoothing
                                className="camera"
                            />
                            <p className="countdown-text" style={{ color: "red" }}>
                                {faceDetected ? `Steady... ${countdown} seconds left` : ""}
                            </p>
                            <canvas ref={canvasRef} />
                        </div>
                    ) : (
                        <div className="image-review-section">
                            {capturedImage && (
                                <Image src={capturedImage} alt="Captured ID" layout="responsive" width={500} height={500} />
                            )}
                            {isExtractingFace && <Loader />}
                            {faceImage && (
                                <div className="face-image-section">
                                    <Image src={faceImage} alt="Extracted Face" layout="responsive" width={200} height={200} />
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <p className="vid-text">
                        Camera access is not granted. Please allow camera access.
                    </p>
                )}
            </div>

            <AgreementFooter
                onPagination={false}
                onLeftButton={!!faceImage}
                onRightButton={true}
                btnLeftText="Recapture"
                onClickBtnLeftAction={recaptureImage}
                btnRightText={faceImage ? "Next" : "Capture"}
                onClickBtnRightAction={faceImage ? undefined : captureFrame}
                rightdisabled={!faceDetected}
                btnRightLink={capturedImage ? "/identity-profile/id-detection/step-2" : undefined}
            />
        </div>
    );
};

export default CameraIDCardDetection;
