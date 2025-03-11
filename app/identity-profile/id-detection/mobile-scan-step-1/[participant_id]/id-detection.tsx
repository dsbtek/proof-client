"use client";

import { useCameraPermissions } from "@/hooks/useCameraPermissions";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useIDDetection } from "@/hooks/useIDDetection";
import useResponsive from "@/hooks/useResponsive";
import { authToken } from "@/redux/slices/auth";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import CameraIDCardDetectionMobile from "./mobile";

const CameraIDCardDetection = () => {
  const { participant_id } = useSelector(authToken);
  const isDesktop = useResponsive();
  const permissionsGranted = useCameraPermissions();
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
    <h1>This feature is only used on mobile </h1>
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
    />
  );
};

export default CameraIDCardDetection;
