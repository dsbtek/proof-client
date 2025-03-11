"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AgreementFooter,
  AppContainer,
  AppHeader,
  Button,
  GenerateQRCode,
  IDCardForm,
  IdTimer,
  Loader_,
  Scanner,
} from "@/components";
import { uploadImagesToS3 } from "../step-1/action";
import { authToken } from "@/redux/slices/auth";
import { idType } from "@/redux/slices/appConfig";
import PassportCapture from "@/components/scanditize/IdCapture";
import DdBarcodeScanner from "@/components/DdBarcodeScanner/DdBarcodeScanner";

const CameraBarcodeDetection = () => {
  const router = useRouter();
  const { participant_id } = useSelector(authToken);
  const docType = useSelector(idType);
  const [generateQr, setGenerateQr] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showBCModal, setShowBCModal] = useState<boolean>(false);
  const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
  const [showBCModalDesktop, setShowBCModalDesktop] = useState<boolean>(true);
  const [barcodeUploadedDesktop, setBarcodeUploadedDesktop] =
    useState<boolean>(true);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [isUseWebCam, setIsUseWebCam] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showInvalidBack, setShowInvalidBack] = useState<boolean>(false);
  const cameraRef = useRef<Webcam | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  const closeBCModal = () => {
    setShowBCModal(false);
    setBarcodeUploaded(false);
    router.push("/identity-profile/sample-facial-capture");
  };

  const barcodeCapture = useCallback(async () => {
    try {
      setBarcodeUploaded(true);
      setShowBCModal(true);
    } catch (error) {
      toast.error("Error detecting barcode. Please try again.");
      console.error("Barcode Capture Error:", error);
    }
  }, []);

  const handleOffScanner = () => {
    setIsUseWebCam(true);
    setShowBCModal(false);
    setShowBCModalDesktop(!showBCModalDesktop);
    setBarcodeUploadedDesktop(!barcodeUploadedDesktop);
    setShowForm(false);
  };

  const goToStep3 = useCallback(() => {
    try {
      console.log("goToStep3");
      router.push("/identity-profile/sample-facial-capture");
      console.log("goToStep3 2");
    } catch (error) {
      toast.error("Error navigating to next step");
      console.error("Navigation Error:", error);
    }
  }, [router]);

  const captureFrame = useCallback(async () => {
    try {
      const imageSrc = cameraRef?.current?.getScreenshot();
      const idCapture = `${participant_id}-IDCapture-Rear-${Date.now()}.png`;
      setCapturedImage(imageSrc as any);
      // await uploadFileToS3(imageSrc!, idCapture);
      setLoading(true);
      // const extractedData = await extractIdAndFace(
      //   imageSrc!.replace(/^data:image\/\w+;base64,/, "")
      // );
      // if (extractedData?.data?.ID_TYPE !== "DRIVER LICENSE BACK")
      //   setShowInvalidBack(true);
      // console.log(extractedData, "results");
      await uploadImagesToS3(imageSrc!, idCapture);
      // dispatch(setBarcodePip2Url(imageSrc!)); //set in redux for barcode url
      setLoading(false);
    } catch (error) {
      console.error("ID Rear capture Error: ", error);
    }
  }, [participant_id]);

  const startTimer = (timeLimit: number) => {
    setTimeLeft(timeLimit);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const updatedTime = prev - 1;
        if (updatedTime <= 0) {
          setShowTimer(false);
          clearInterval(timerIntervalRef.current as NodeJS.Timeout);
          captureFrame();
        }
        return updatedTime;
      });
    }, 1000);
  };

  const handleCapture = () => {
    setShowCountdown(true);
    startTimer(5);
    setShowTimer(true);
  };

  const handleNextAction = () => {
    if (showForm) {
      goToStep3();
    } else if (!showBCModal && !showForm && !barcodeUploadedDesktop) {
      handleCapture();
    } else if (capturedImage) {
      goToStep3();
    } else {
      barcodeCapture();
    }
  };
  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleNextText = () => {
    if (showForm) {
      return "Confirm";
    } else if (
      !showBCModal &&
      !showForm &&
      !barcodeUploadedDesktop &&
      !capturedImage
    ) {
      return "Capture";
    } else if (
      !showBCModal &&
      !showForm &&
      !barcodeUploadedDesktop &&
      capturedImage
    ) {
      return "Next";
    } else {
      return "Scan ID";
    }
  };

  return (
    <>
      {generateQr && <GenerateQRCode onClose={() => setGenerateQr(false)} />}
      <AppContainer
        header={<AppHeader title="PIP - Step 2" hasMute={false} />}
        body={
          <div
            className="id-detection-container"
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <>
              {!showBCModal && <br />}
              {showBCModal && (
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "997",
                  }}
                >
                  {docType === "PS" ? (
                    <PassportCapture
                      show={showBCModal}
                      scanType="id"
                      barcodeUploaded={barcodeUploaded}
                      step={2}
                      totalSteps={3}
                      recapture={() => setShowBCModal(false)}
                      closeModal={closeBCModal}
                    />
                  ) : (
                    // <DdBarcodeScanner
                    //   show={true}
                    //   scanType="id"
                    //   barcodeUploaded={true}
                    //   recapture={false}
                    //   closeModal={closeBCModal}
                    // />
                    <Scanner
                      show={true}
                      scanType="id"
                      barcodeUploaded={true}
                      recapture={false}
                      closeModal={closeBCModal}
                      onBarcodeScan={() => {}}
                      qrScan={true}
                    />
                  )}
                  (
                  <Button
                    blue
                    style={{
                      width: "fit-content",
                      height: "48px",
                      borderRadius: "12px",
                      textWrap: "nowrap",
                      fontSize: "1rem",
                      margin: "20px auto",
                      position: "absolute",
                      bottom: "2%",
                      left: "35%",
                      zIndex: "10000",
                    }}
                    onClick={() => handleOffScanner()}
                  >
                    {"Manual Capture"}
                  </Button>
                  )
                </div>
              )}
              {!isUseWebCam && !showBCModal && !showForm && (
                <>
                  <p className="vid-text with-bullet">
                    Please position the rear side of your ID <br />
                  </p>
                  <Image
                    className="id-image-2"
                    src="/images/id-back.svg"
                    alt="captured Image"
                    width={5000}
                    height={5000}
                    loading="lazy"
                  />
                  <br />
                  <p className="vid-text m-5 with-bullet">
                    Please tap the `Scan ID` button to begin scanning your ID
                    card.
                  </p>
                </>
              )}

              {isUseWebCam && !capturedImage && !showBCModal ? (
                <>
                  <div
                    className="camera-container-2"
                    style={{ height: "100%" }}
                  >
                    <Webcam
                      className="camera"
                      ref={cameraRef}
                      audio={false}
                      screenshotFormat="image/png"
                      imageSmoothing={true}
                      mirrored={true}
                      style={{
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "16px",
                      }}
                    />
                    <div
                      // className="id-card-frame-guide"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        // height: '100%',
                        top: "13%",
                        zIndex: 999,
                        position: "absolute",
                        padding: "8px",
                      }}
                    >
                      <div className="box">
                        <div className="content">
                          {/* {showTimer && timeLeft && timeLeft > 0 && (
                            <IdTimer timeLeft={timeLeft} />
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                capturedImage &&
                !showBCModal && (
                  <>
                    {showInvalidBack && (
                      <div className="scan-with-mobile">
                        <div className="info-icon">
                          <Image
                            width={500}
                            height={500}
                            src={"/icons/info-icon.svg"}
                            alt={"info icon"}
                            style={{
                              height: "22px",
                              width: "22px",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            color: "#0C1617",
                            fontSize: "16px",
                            fontWeight: "600px",
                            lineHeight: "20px",
                          }}
                        >
                          ID back could not be verified as valid please
                          Recapture!!!
                        </p>
                      </div>
                    )}
                    <div
                      className="test-items-wrap-desktop_"
                      style={{
                        borderRadius: "0 16px 16px 0",
                        height: "100%",
                      }}
                    >
                      <div className="id-image">
                        <Image
                          className="img-border"
                          src={capturedImage}
                          alt="Captured Image"
                          layout="responsive"
                          width={500}
                          height={500}
                        />
                        {loading && <Loader_ />}
                      </div>
                    </div>
                  </>
                )
              )}

              {showForm && !showBCModal && (
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "1000",
                    backgroundColor: "#ecf1f3",
                    padding: "8px",
                  }}
                >
                  <IDCardForm setShowForm={setShowForm} goToStep3={goToStep3} />
                </div>
              )}
            </>

            <AgreementFooter
              onPagination={false}
              onLeftButton={capturedImage ? true : false}
              onRightButton={true}
              btnRightText={
                showCountdown && timeLeft > 0 ? `${timeLeft}` : handleNextText()
              }
              btnLeftText={capturedImage ? "Recapture" : ""}
              onClickBtnRightAction={
                capturedImage && !showForm ? handleShowForm : handleNextAction
              }
              onClickBtnLeftAction={() => {
                setCapturedImage(null);
              }}
              btnRightLink={
                capturedImage && showForm
                  ? "/identity-profile/sample-facial-capture"
                  : ""
              }
            />
          </div>
        }
        footer={""}
      />
      {}
    </>
  );
};

export default CameraBarcodeDetection;
