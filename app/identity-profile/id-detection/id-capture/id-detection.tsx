'use client';

import { useSelector } from 'react-redux';
import { authToken } from '@/redux/slices/auth';
import CameraIDCardDetectionMobile from './mobile';
import CameraIDCardDetectionDesktop from './desktop';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import useResponsive from '@/hooks/useResponsive';
import Webcam from 'react-webcam';
import { useRef, useState } from 'react';
import { useIDDetection } from '@/hooks/useIDDetection';
import { testingKit } from '@/redux/slices/drugTest';

const CameraIDCardDetection = () => {
    const { participant_id } = useSelector(authToken);
    const isDesktop = useResponsive();
    const permissionsGranted = useCameraPermissions();
    const { kit_id, Scan_Kit_Label } = useSelector(testingKit);
    const cameraRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {
        manualCaptureImage,
        manualFaceImage,
        timeLeft,
        // captureFrame,
        isVisible,
        // isLoaderVisible,
        // isDocTypeVisible,
        // isLoading,
        recaptureManualImage,
        handleManualCapture,
        // handleLoaderClose,
        showCountdown,
    } = useFaceDetection(participant_id as any, cameraRef);

    const {
        faceImage,
        capturedImage,
        captureFrame,
        // isVisible,
        isLoaderVisible,
        isDocTypeVisible,
        isLoading,
        recaptureImage,
        handleDocClose,
        handleLoaderClose,
        // isConnected,
        errorMsg,
    } = useIDDetection(participant_id as string, cameraRef);
    const [webcamKey, setWebcamKey] = useState(0);

    return isDesktop ? (
        <CameraIDCardDetectionDesktop
            permissionsGranted={permissionsGranted.permissionsGranted}
            capturedImage={capturedImage || manualCaptureImage}
            faceImage={faceImage || manualFaceImage}
            timeLeft={timeLeft}
            isLoading={isLoading}
            isDocTypeVisible={isDocTypeVisible}
            isVisible={isVisible}
            isLoaderVisible={isLoaderVisible}
            recaptureImage={recaptureImage}
            handleDocClose={handleDocClose}
            handleLoaderClose={handleLoaderClose}
            captureFrame={captureFrame}
            cameraRef={cameraRef}
            canvasRef={canvasRef}
            webcamKey={webcamKey}
            // socketConnected={isConnected}
            socketConnected={true}
            errorMsg={errorMsg as string}
            handleManualCapture={handleManualCapture}
            recaptureManualImage={recaptureManualImage}
            showCountdown={showCountdown}
        />
    ) : (
        <CameraIDCardDetectionMobile
            permissionsGranted={permissionsGranted.permissionsGranted}
            capturedImage={capturedImage || manualCaptureImage}
            faceImage={faceImage || manualFaceImage}
            timeLeft={timeLeft}
            isLoading={isLoading}
            isDocTypeVisible={isDocTypeVisible}
            isVisible={isVisible}
            recaptureImage={recaptureImage}
            isLoaderVisible={isLoaderVisible}
            handleDocClose={handleDocClose}
            handleLoaderClose={handleLoaderClose}
            captureFrame={captureFrame}
            cameraRef={cameraRef}
            canvasRef={canvasRef}
            webcamKey={webcamKey}
            // socketConnected={isConnected}
            socketConnected={true}
            errorMsg={errorMsg as string}
            handleManualCapture={handleManualCapture}
            recaptureManualImage={recaptureManualImage}
            showCountdown={showCountdown}
        />
    );
};

export default CameraIDCardDetection;
