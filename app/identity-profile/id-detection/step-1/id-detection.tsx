"use client";

import { useSelector } from "react-redux";
import { authToken } from "@/redux/slices/auth";
import CameraIDCardDetectionMobile from "./mobile";
import CameraIDCardDetectionDesktop from "./desktop";
import { useCameraPermissions } from "@/hooks/useCameraPermissions";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import useResponsive from "@/hooks/useResponsive";
import Webcam from "react-webcam";
import { useRef, useState } from "react";

const CameraIDCardDetection = () => {
  const { participant_id } = useSelector(authToken);
  const isDesktop = useResponsive();
  const permissionsGranted = useCameraPermissions();
  const cameraRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
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
  } = useFaceDetection(participant_id as any, cameraRef);
  const [webcamKey, setWebcamKey] = useState(0);

  return isDesktop ? (
    <CameraIDCardDetectionDesktop
      permissionsGranted={permissionsGranted}
      capturedImage={capturedImage}
      faceImage={faceImage}
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
    />
  ) : (
      <CameraIDCardDetectionMobile
        permissionsGranted={permissionsGranted}
        capturedImage={capturedImage}
        faceImage={faceImage}
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
      />
  );
};

export default CameraIDCardDetection;
