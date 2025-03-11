import {
    setAlcoOraltoxAIResult,
    setAlocholImg,
    setAlcoOraltoxAIResult_,
    setOraltoxImg,
    setOraltoxResult,
} from '@/redux/slices/appConfig';
import { testData } from '@/redux/slices/drugTest';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

interface AlcoOralResponse {
    status: string;
    message: string;
    [key: string]: any;
}

const useAlcoholDetection = (
    cameraRef: React.RefObject<Webcam | null>,
    testType: 'alco' | 'oraltox',
    canvasRef?: React.RefObject<HTMLCanvasElement | null>,
) => {
    const dispatch = useDispatch();
    const [alcoOralRes, setAlcoOralRes] = useState<AlcoOralResponse | null>(
        null,
    );
    const [alcoOralHasRes, setAlcoOralHasRes] = useState(false);
    const [msg, setMsg] = useState<string | undefined>();
    const [isSuccess, setIsSuccess] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [counter, setCounter] = useState(0);
    const [retryCounter, setRetryCounter] = useState(0);
    const [showTimer, setShowTimer] = useState<boolean>(true);
    const [time, setTime] = useState<number>(30);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [capturedCanvas, setCapturedCanvas] = useState<string | null>(null);

    const drawVideoOnCanvas = (
        context: CanvasRenderingContext2D,
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
    ) => {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;

        let sx = 0,
            sy = 0,
            sWidth = canvas.width,
            sHeight = canvas.height;

        if (videoAspectRatio > canvasAspectRatio) {
            // Video is wider than canvas
            sHeight = video.videoHeight;
            sWidth = sHeight * canvasAspectRatio;
            sx = (video.videoWidth - sWidth) / 2;
        } else {
            // Video is taller than canvas
            sWidth = video.videoWidth;
            sHeight = sWidth / canvasAspectRatio;
            sy = (video.videoHeight - sHeight) / 2;
        }

        context.drawImage(
            video,
            sx,
            sy,
            sWidth,
            sy,
            0,
            0,
            canvas.width,
            canvas.height,
        );
    };

    const drawSilhouetteGuide = (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
    ) => {
        const guideWidth = canvas.width * 0.8; // 80% of canvas width
        const guideHeight = canvas.height * 0.2; // 10% of canvas height
        const guideX = (canvas.width - guideWidth) / 2;
        const guideY = (canvas.height - guideHeight) / 2;

        context.strokeStyle = 'red';
        context.lineWidth = 4;
        context.strokeRect(guideX, guideY, guideWidth, guideHeight);
    };

    const captureSilhouetteRegion = (
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        guideX: number,
        guideY: number,
        guideWidth: number,
        guideHeight: number,
    ) => {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;

        let sx = 0,
            sy = 0,
            sWidth = video.videoWidth,
            sHeight = video.videoHeight;

        if (videoAspectRatio > canvasAspectRatio) {
            sHeight = video.videoHeight;
            sWidth = sHeight * canvasAspectRatio;
            sx = (video.videoWidth - sWidth) / 2;
        } else {
            sWidth = video.videoWidth;
            sHeight = sWidth / canvasAspectRatio;
            sy = (video.videoHeight - sHeight) / 2;
        }

        // Map guide coordinates to video source coordinates
        const scaleX = sWidth / canvas.width;
        const scaleY = sHeight / canvas.height;

        const videoGuideX = sx + guideX * scaleX;
        const videoGuideY = sy + guideY * scaleY;
        const videoGuideWidth = guideWidth * scaleX;
        const videoGuideHeight = guideHeight * scaleY;

        // Capture the region
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = guideWidth;
        tempCanvas.height = guideHeight;
        const tempContext = tempCanvas.getContext('2d');

        if (tempContext) {
            tempContext.drawImage(
                video,
                videoGuideX,
                videoGuideY,
                videoGuideWidth,
                videoGuideHeight, // Source
                0,
                0,
                guideWidth,
                guideHeight, // Destination
            );
        }

        return tempCanvas.toDataURL('image/png');
    };

    const resetState = () => {
        setLoaderVisible(false);
        setTime(30);
        setShowTimer(true);
        setAlcoOralHasRes(false);
        setStopTimer(false);
        setCounter(0);
        // Clear the canvas
        if (canvasRef?.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        // Reset the captured canvas data
        setCapturedCanvas(null);
    };

    // const captureCanvasImage = () => {
    //     if (!cameraRef.current || !canvasRef?.current) return null;

    //     const video = cameraRef.current.video;
    //     const canvas = canvasRef.current;

    //     if (!video || !canvas) return null;

    //     const context = canvas.getContext('2d');
    //     if (!context) return null;

    //     // Match the canvas dimensions to its container
    //     canvas.width = canvas.offsetWidth;
    //     canvas.height = canvas.offsetHeight;

    //     // Calculate aspect ratios
    //     const videoAspectRatio = video.videoWidth / video.videoHeight;
    //     const canvasAspectRatio = canvas.width / canvas.height;

    //     let sx, sy, sWidth, sHeight;

    //     if (videoAspectRatio > canvasAspectRatio) {
    //         // Video is wider than canvas
    //         sHeight = video.videoHeight;
    //         sWidth = sHeight * canvasAspectRatio; // Scale width to match aspect ratio
    //         sx = (video.videoWidth - sWidth) / 2; // Center horizontally
    //         sy = 0; // No vertical cropping
    //     } else {
    //         // Video is taller than canvas
    //         sWidth = video.videoWidth;
    //         sHeight = sWidth / canvasAspectRatio; // Scale height to match aspect ratio
    //         sx = 0; // No horizontal cropping
    //         sy = (video.videoHeight - sHeight) / 2; // Center vertically
    //     }

    //     // Clear the canvas before drawing
    //     context.clearRect(0, 0, canvas.width, canvas.height);

    //     // Draw the cropped video feed onto the canvas
    //     context.drawImage(
    //         video,
    //         sx,
    //         sy,
    //         sWidth,
    //         sHeight, // Source rectangle from the video
    //         0,
    //         0,
    //         canvas.width,
    //         canvas.height, // Destination rectangle on the canvas
    //     );

    //     return canvas.toDataURL('image/png');
    // };

    const captureCanvasImage = () => {
        if (!cameraRef.current || !canvasRef?.current) return null;

        const video = cameraRef.current.video;
        const canvas = canvasRef.current;

        if (!video || !canvas) return null;

        const context = canvas.getContext('2d');
        if (!context) return null;

        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        // Draw the video on the canvas
        drawVideoOnCanvas(context, video, canvas);

        // Define silhouette guide
        const guideWidth = canvas.width * 0.8;
        const guideHeight = canvas.height * 0.5;
        const guideX = (canvas.width - guideWidth) / 2;
        const guideY = (canvas.height - guideHeight) / 2;

        // Draw the silhouette guide
        // drawSilhouetteGuide(context, canvas);

        // Capture the specific region for AI detection
        return captureSilhouetteRegion(
            video,
            canvas,
            guideX,
            guideY,
            guideWidth,
            guideHeight,
        );
    };

    const handleResponse = (response: AlcoOralResponse, screenshot: string) => {
        const { status, message } = response;
        dispatch(setAlcoOraltoxAIResult_(response.data));
        dispatch(setAlocholImg(screenshot));
        setIsSuccess(true);
        setAlcoOralRes(response);
        setMsg(message);
        setAlcoOralHasRes(true);
    };

    const checkAlcoOraltoxAIRes = (response: AlcoOralResponse) => {
        console.log('Response:', response.data);
        if (response.data == 'Positive') return true;
        if (response.data !== 'Positive' && retryCounter === 3) {
            toast.info(
                'Ensure the strip is within the silhouette for optimal detection.',
            );
            setRetryCounter(0);
            return false;
        }
        setRetryCounter((prev) => prev + 1);
        return false;
    };

    const checkForAlcoOraltox = useCallback(async () => {
        if (!cameraRef.current) return false;

        const screenshot = cameraRef.current.getScreenshot();
        if (!screenshot) return false;

        const imageBase64 = captureCanvasImage()?.replace(
            /^data:image\/\w+;base64,/,
            '',
        );

        if (!imageBase64) {
            toast.error('Failed to capture the image.');
            return false;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/read-oraltox-device`,
                { base64_image: imageBase64, type: testType },
                { headers: { 'Content-Type': 'application/json' } },
            );
            handleResponse(response.data, screenshot);
            const res = checkAlcoOraltoxAIRes(response.data);
            if (res) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking device:', error);
            toast.error('Failed to process the image.');
        }
    }, [cameraRef, testType, dispatch, counter, retryCounter]);

    useEffect(() => {
        if (stopTimer) return;
        const interval = setInterval(async () => {
            const res = checkForAlcoOraltox();
            if (await res) {
                setShowTimer(false);
                setStopTimer(true);
                clearInterval(interval);
                setLoaderVisible(true);
                return;
            }
            setTime((prev) => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    setShowTimer(false);
                    setStopTimer(true);
                    clearInterval(interval);
                    setLoaderVisible(true);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [stopTimer, checkForAlcoOraltox]);
    return {
        msg,
        isSuccess,
        alcoOralHasRes,
        alcoOralRes,
        showTimer,
        time,
        isLoaderVisible,
        recapture: resetState,
        stopTimer,
    };
};
export default useAlcoholDetection;
