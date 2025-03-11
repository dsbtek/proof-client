"use client";

import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { CSSProperties } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AgreementFooter,
  AlcoResultModal,
  AppContainer,
  AppHeader,
  DesktopFooter,
  Loader_,
  Timer,
} from "@/components";
import { testingKit } from "@/redux/slices/drugTest";
import useResponsive from "@/hooks/useResponsive";
import useAlcoOralDetector from "@/hooks/useAlcoOraltox";
import useAlcoholDetection from "@/hooks/useAlcoholDetection";

interface IAlcoholDetection {
  permissionsGranted?: boolean;
  cameraRef: RefObject<Webcam>;
  canvasRef: RefObject<HTMLCanvasElement>;
  webcamKey?: number;
  errorMsg?: string;
}

const Mobile = ({ canvasRef, cameraRef }: IAlcoholDetection) => {
  const [mediaError, setMediaError] = useState<any>();
  return (
    <div className="aloco-container">
      <h3 className="alco-text">
        Place the test device within the clear silhouette.
      </h3>
      <div className="camera-container">
        <Webcam
          className="alco-camera"
          ref={cameraRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: "environment" }}
          imageSmoothing={true}
          //   mirrored
          onUserMediaError={(error) => {
            setMediaError(error);
            toast.error("Camera access denied. Please check your settings.");
          }}
        />
        <div className="frameStyle">
          <div className="wrap-alco-silhoutte">
            <div className="alco-silhoutte"></div>
            <div className="alco-silhoutte_"></div>
            <canvas className="alco-canvas" ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Mobile;
