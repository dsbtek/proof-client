"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useResponsive from "@/hooks/useResponsive";
import {
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
import { TbCapture } from "react-icons/tb";
import { idType } from "@/redux/slices/appConfig";
import PassportCapture from "@/components/scanditize/IdCapture";
import Link from "next/link";
import { setBarcodePip2Url, setIdDetails } from "@/redux/slices/drugTest";
import IScannner from "@/components/scanditize/IOSScanner";
import { extractIdAndFace } from "@/utils/queries";
import DdBarcodeScanner from "@/components/DdBarcodeScanner/DdBarcodeScanner";

const CameraBarcodeDetection = () => {
  const router = useRouter();
  const isDesktop = useResponsive();
  const dispatch = useDispatch();
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
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showInvalidBack, setShowInvalidBack] = useState<boolean>(false);
  const formRef = useRef(null);
  const cameraRef = useRef<Webcam | null>(null);
  const timerId = useRef<NodeJS.Timeout | undefined>();
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
    setShowBCModalDesktop(!showBCModalDesktop);
    setBarcodeUploadedDesktop(!barcodeUploadedDesktop);
    setShowForm(!showForm);
  };

  const goToStep3 = () => {
    try {
      router.push("/identity-profile/sample-facial-capture");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleNext = () => {
    setShowForm(false);
  };

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

  return (
    <>
      {generateQr && <GenerateQRCode onClose={() => setGenerateQr(false)} />}
      <AppContainer
        header={<AppHeader title="PIP - Step 2" hasMute={false} />}
        body={
          <div
            className="id-detection-container_"
            style={{ position: "relative" }}
          >
            <>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="camera-wrap-desktop"
                  style={{ paddingBottom: "20px" }}
                >
                  <div
                    className="sub-item-2"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                  >
                    <div style={{ minHeight: "10px" }}>
                      <h3 className="">PIP - Step 2</h3>
                      <br />
                      <li className="m-5 rear-id-text-instruction">
                        Please position the rear side of your ID <br />
                      </li>
                      <li className="rear-id-text-instruction m-5">
                        Please ensure the barcode covers &gt; 70% of the screen.
                      </li>

                      <>
                        <br />
                        <p
                          style={{
                            color: "##2E3740",
                            fontSize: "16px",
                            fontWeight: "700px",
                            lineHeight: "26px",
                          }}
                        >
                          Can`t Scan ID Barcode?
                        </p>
                        <br />
                        <Button
                          blue
                          style={{
                            width: "fit-content",
                            // padding: "12px 36px",
                            height: "48px",
                            borderRadius: "12px",
                            textWrap: "nowrap",
                            fontSize: "1rem",
                          }}
                          onClick={() => handleOffScanner()}
                        >
                          {barcodeUploadedDesktop
                            ? "Manual Capture"
                            : "Automatic Capture"}
                        </Button>
                      </>
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
                          To get the best scan quality, use your smartphone by
                          <span
                            style={{
                              color: "#009CF9",
                              marginLeft: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => setGenerateQr(true)}
                          >
                            clicking here
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Facilitates Automatic Capture */}
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "50%",
                    height: "100%",
                    zIndex: "997",
                  }}
                >
                  {docType === "PS" ? (
                    <PassportCapture
                      show={showBCModal}
                      scanType="id"
                      barcodeUploaded={true}
                      step={2}
                      totalSteps={3}
                      recapture={() => {
                        setShowBCModal(false);
                      }}
                      closeModal={closeBCModal}
                    />
                  ) : (
                    // <DdBarcodeScanner
                    //     show={true}
                    //     scanType="id"
                    //     barcodeUploaded={true}
                    //     recapture={false}
                    //     closeModal={closeBCModal}
                    // />
                    <Scanner
                      show={true}
                      scanType="id"
                      barcodeUploaded={true}
                      // step={2}
                      // totalSteps={3}
                      recapture={false}
                      closeModal={closeBCModal}
                      onBarcodeScan={() => {}}
                      qrScan={true}
                    />
                  )}
                </div>
                {/* Facilitates Manual Capture */}
                {showForm && !showBCModalDesktop && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      width: "50%",
                      height: "100%",
                      zIndex: "998",
                    }}
                  >
                    {!capturedImage && !showBCModalDesktop ? (
                      <>
                        <div className="camera-container-2">
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
                              height: "100%",
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
                        <div className="barcode-btns">
                          <Button
                            blue
                            style={{
                              width: "fit-content",
                              padding: "8px 36px",
                              height: "48px",
                              fontSize: "1rem",
                              gap: "8px",
                            }}
                            onClick={handleCapture}
                            disabled={showTimer}
                          >
                            <TbCapture />{" "}
                            {timeLeft > 0 && showCountdown
                              ? `${timeLeft}`
                              : "Capture"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      capturedImage &&
                      !showBCModalDesktop && (
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
                            <div className="barcode-btns">
                              <Button
                                white
                                style={{
                                  width: "fit-content",
                                  padding: "8px 36px",
                                  height: "48px",
                                  fontSize: "1rem",
                                  gap: "8px",
                                }}
                                onClick={() => {
                                  setCapturedImage(null);
                                }}
                              >
                                <TbCapture /> Recapture
                              </Button>
                              <Button
                                blue
                                style={{
                                  width: "fit-content",
                                  padding: "8px 36px",
                                  height: "48px",
                                  fontSize: "1rem",
                                }}
                                onClick={handleNext}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                )}
                {!showForm && !showBCModalDesktop && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      width: "50%",
                      height: "100%",
                      zIndex: "998",
                    }}
                  >
                    <IDCardForm
                      setShowForm={setShowForm}
                      goToStep3={goToStep3}
                    />
                  </div>
                )}
              </div>
            </>
          </div>
        }
        footer={""}
      />
      {}
    </>
  );
};

export default CameraBarcodeDetection;
