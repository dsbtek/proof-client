"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  Timer,
} from "@/components";
import { testingKit } from "@/redux/slices/drugTest";
import { authToken } from "@/redux/slices/auth";
import useResponsive from "@/hooks/useResponsive";
import useOraltoxDetector from "@/hooks/useOraltoxDetector";
import DdBarcodeScanner from "@/components/DdBarcodeScanner/DdBarcodeScanner";

const OralToxDetection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { kit_name } = useSelector(testingKit);
  const isDesktop = useResponsive();
  const { participant_id } = useSelector(authToken);
  const cameraRef = useRef<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [webcamKey, setWebcamKey] = useState(0);
  const [mediaError, setMediaError] = useState<any>();
  const { msg, isSuccess, isLoaderVisible, time, showTimer, recapture } =
    useOraltoxDetector(cameraRef, "oraltox");
  const [barcodeCapture, setBarcodeCapture] = useState<boolean>(false);
  const [barcode_, setEnterBarcode] = useState<boolean>(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcodeUploaded, setBarcodeUploaded] = useState(false);
  const [showBCModal, setShowBCModal] = useState(true);
  const [scanType, setScanType] = useState<"test" | "fedex">("test");

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
    router.push("/test-collection/rapid-test/oraltox/oral-result");
  };

  return (
    <>
      <AlcoResultModal
        isVisible={isLoaderVisible}
        onClose={handleCloseModal}
        result={msg}
        success={isSuccess}
        testType={"Oraltox"}
        reCapture={recapture}
        isTimeOut={!showTimer}
      />
      <AppContainer
        header={<AppHeader title={kit_name} hasMute={false} />}
        body={
          !isDesktop ? (
            <div
              className="aloco-container"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <h3 className="alco-text">
                Place the test device within the clear silhouette
              </h3>
              <div className="camera-container">
                <div className="wrap-camera">
                  <Webcam
                    className="camera-alco-oraltox"
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/png"
                    videoConstraints={{
                      facingMode: "environment",
                    }}
                    imageSmoothing={true}
                    // mirrored
                    onUserMediaError={(error) => {
                      setMediaError(error);
                      toast.error(
                        "Camera access denied. Please check your settings."
                      );
                    }}
                  />
                </div>
                <div className="oraltox-qr-scanner">
                  <DdBarcodeScanner
                    show={showBCModal}
                    scanType={scanType}
                    barcodeUploaded={barcodeUploaded}
                    recapture={false}
                    closeModal={showBCModal as any}
                    barcode={barcodeValue}
                    setBarcode={setBarcodeValue}
                    captureImageFn={barcodeCapture as any}
                    capturedImage={capturedImage as any}
                    setEnterManual={setEnterBarcode}
                  />
                </div>
                <div className="frameStyleOraltox">
                  <Image
                    src={"/images/oraltox-silhouette-new.svg"}
                    className="oraltox-silhoutte"
                    alt={"Oratox Silhoutte"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="id-detection-container_">
              <div className="test-items-wrap-desktop_">
                <div className="sub-item">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "10px",
                      height: "50%",
                    }}
                  >
                    <h3 className="">Align to test device</h3>
                    <p>{barcodeValue}</p>
                    <br />
                    <p className="with-bullet">
                      Place the test device precisely within the clear
                      silhouette to ensure accurate positioning and reliable
                      results.
                    </p>
                  </div>
                </div>

                <div className="camera-container">
                  <div className="wrap-camera">
                    <Webcam
                      className="alco-camera"
                      ref={cameraRef}
                      audio={false}
                      screenshotFormat="image/png"
                      videoConstraints={{
                        facingMode: "user",
                      }}
                      imageSmoothing={true}
                      mirrored
                    />
                    <div className="frameStyleOraltox">
                      <Image
                        src={"/images/oraltox-silhouette-new.svg"}
                        alt={"Oratox Silhoutte"}
                        className="oraltox-silhoutte"
                      />
                    </div>
                  </div>

                  <div className="desktop-scanner">
                    <DdBarcodeScanner
                      show={showBCModal}
                      scanType={scanType}
                      barcodeUploaded={barcodeUploaded}
                      recapture={false}
                      closeModal={showBCModal as any}
                      barcode={barcodeValue}
                      setBarcode={setBarcodeValue}
                      captureImageFn={barcodeCapture as any}
                      capturedImage={capturedImage as any}
                      setEnterManual={setEnterBarcode}
                    />
                  </div>
                </div>
              </div>
            </div>
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
              btnLeftText={"Recapture"}
              btnRightText={"Next"}
              onClickBtnLeftAction={recapture}
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
              btnLeftText={"Recapture"}
              btnRightText={"Next"}
              onClickBtnRightAction={recapture}
            />
          )
        }
      />
    </>
  );
};
export default OralToxDetection;
