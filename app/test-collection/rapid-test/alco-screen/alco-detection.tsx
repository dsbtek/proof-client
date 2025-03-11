"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
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
import Mobile from "./mobile";
import Desktop from "./desktop";

const AlcoCapture = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { kit_name } = useSelector(testingKit);
  const cameraRef = useRef<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState(false);
  const [webcamKey, setWebcamKey] = useState(0);
  const [mediaError, setMediaError] = useState<any>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDesktop = useResponsive();
  const {
    msg,
    isSuccess,
    alcoOralHasRes,
    isLoaderVisible,
    recapture,
    time,
    showTimer,
    stopTimer,
  } = useAlcoholDetection(cameraRef, "alco", canvasRef);

  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        const stream = cameraRef.current.stream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const handleCloseModal = () => {
    router.push("/test-collection/rapid-test/alco-result");
  };

  return (
    <>
      <AlcoResultModal
        isVisible={isLoaderVisible}
        onClose={handleCloseModal}
        result={msg}
        reCapture={recapture}
        testType={"Alco"}
        success={isSuccess}
        isTimeOut={alcoOralHasRes}
      />
      <AppContainer
        header={<AppHeader title={kit_name} hasMute={false} />}
        body={
          !isDesktop ? (
            <Mobile cameraRef={cameraRef} canvasRef={canvasRef} />
          ) : (
            <Desktop cameraRef={cameraRef} canvasRef={canvasRef} />
          )
        }
        footer={
          !isDesktop ? (
            <AgreementFooter
              currentNumber={2}
              outOf={4}
              onPagination={false}
              onLeftButton={false}
              onRightButton={false}
              btnLeftLink={""}
              btnRightLink={""}
              btnLeftText={"Clear"}
              btnRightText={""}
            />
          ) : (
            <DesktopFooter
              currentNumber={2}
              outOf={4}
              onPagination={false}
              onLeftButton={false}
              onRightButton={false}
              btnLeftLink={""}
              btnRightLink={""}
              btnLeftText={"Clear"}
              btnRightText={""}
            />
          )
        }
      />
    </>
  );
};
export default AlcoCapture;
