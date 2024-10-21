// hooks/useFaceDetection.ts
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";
import { extractFaceAI } from "@/utils/queries";
import { setExtractedFaceImage, setIDFront } from "@/redux/slices/appConfig";
import { setGovernmentID, setPassport, setProofID } from "@/redux/slices/drugTest";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { uploadFileToS3 } from "@/app/identity-profile/id-detection/step-1/action";

export const useFaceDetection = (participant_id: string, cameraRef: React.RefObject<Webcam>) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [faceImage, setFaceImage] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(5);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [isDocTypeVisible, setDocTypeVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const extractFace = useCallback(async (imgBase64: string) => {
        setIsVisible(true);
        const extractedFaces = await extractFaceAI(imgBase64);
        if (extractedFaces.message === "0 faces found") {
            Sentry.captureMessage("An error occurred extracting face");
            toast.error("Face not detected, Re-try!");
            setIsVisible(false)
            setLoaderVisible(false);
            setCapturedImage(null);
            setTimeLeft(5)
            setDocTypeVisible(true)
            return false;
        }
        setIsVisible(false);
        setLoaderVisible(true);
        return extractedFaces?.result;
    }, []);

    const captureFrame = useCallback(async () => {
        try {
            const dateNow = Date.now();
            const imageSrc = cameraRef?.current?.getScreenshot();
            const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;
            setCapturedImage(imageSrc as any);
            dispatch(setGovernmentID(idCapture));
            dispatch(setIDFront(imageSrc!));
            uploadFileToS3(imageSrc!, idCapture);

            const face = await extractFace(
                imageSrc!.replace(/^data:image\/\w+;base64,/, "")
            );

            if (face) {
                stopTimer()
                const faceBase64 = `data:image/png;base64,${face[0]}`;
                setFaceImage(faceBase64);
                dispatch(setExtractedFaceImage(faceBase64));
                const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
                const proofId = idCapture.split(".")[0];
                dispatch(setPassport(passportCapture));
                dispatch(setProofID(proofId));
                uploadFileToS3(faceBase64, passportCapture);
            }
        } catch (error) {
            toast.error("Error capturing image. Please try again.");
        }
    }, [cameraRef, participant_id, dispatch, extractFace]);

    const startTimer = (timeLimit: number) => {
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
                    setIsLoading(false)
                }
                return updatedTime;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            setTimeLeft(0);
        }
    };
    const handleLoaderClose = () => {
        setLoaderVisible(false);
    };

    const handleDocClose = () => {
        setIsLoading(true);
        startTimer(timeLeft);
        setDocTypeVisible(false);
    };
    const recaptureImage = () => {
        setCapturedImage(null);
        setFaceImage(null);
        setLoaderVisible(false);
        setTimeLeft(5)
        setDocTypeVisible(true)
    };

    useEffect(() => {
        setDocTypeVisible(true);
    }, []);

    return {
        capturedImage,
        faceImage,
        timeLeft,
        captureFrame,
        isVisible,
        isLoaderVisible,
        isDocTypeVisible,
        isLoading,
        recaptureImage,
        handleDocClose,
        handleLoaderClose
    };
};
