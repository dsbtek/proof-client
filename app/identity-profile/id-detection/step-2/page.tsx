"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import useResponsive from "@/hooks/useResponsive";
import {
  AgreementFooter,
  AgreementHeader,
  Button,
  DesktopFooter,
  GenerateQRCode,
  IDCardForm,
  Scanner,
} from "@/components";
import { uploadFileToS3 } from "../step-1/action";
import { authToken } from "@/redux/slices/auth";
import { TbCapture } from "react-icons/tb";
import { idType } from "@/redux/slices/appConfig";
import PassportCapture from "@/components/scanditize/IdCapture";
import Link from "next/link";

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
  const [showFormButton, setShowFormButton] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const cameraRef = useRef<Webcam | null>(null);
  const timerId = useRef<NodeJS.Timeout | undefined>();

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
  };

  const captureFrame = useCallback(async () => {
    try {
      const imageSrc = cameraRef?.current?.getScreenshot();
      const idCapture = `${participant_id}-IDCapture-Rear-${Date.now()}.png`;
      setCapturedImage(imageSrc as any);
      await uploadFileToS3(imageSrc!, idCapture);
    } catch (error) {
      console.error("ID Rear capture Error: ", error);
    }
  }, [participant_id]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      setShowFormButton(true);
    }, 15000);
    return () => clearInterval(timerId.current);
  }, [showBCModalDesktop]);

  return (
    <>
      {generateQr &&
        <GenerateQRCode />
      }
      {!isDesktop ? (
        <div
          className="id-detection-container"
          style={{ position: "relative" }}
        >
          <>
            <AgreementHeader title="PIP - Step 2 " />
            {!showBCModal && <br />}
            {showBCModal && (
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  zIndex: "1000",
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
                  <Scanner
                    show={showBCModal}
                    scanType="id"
                    barcodeUploaded={barcodeUploaded}
                    step={2}
                    totalSteps={3}
                    recapture={() => setShowBCModal(false)}
                    closeModal={closeBCModal}
                  />
                )}
              </div>
            )}
            {!showBCModal && (
              <>
                <p className="vid-text">
                  Please position the rear side of your ID <br />
                </p>
                <Image
                  className="id-image-2"
                  src="/images/proof-identity-profile.svg"
                  alt="captured Image"
                  width={5000}
                  height={5000}
                  loading="lazy"
                />
                <br />
                <p className="vid-text m-5">
                  Please tap the `Scan ID` button to begin scanning your ID
                  card.
                </p>
              </>
            )}
            <br />
          </>

          {!showBCModal ? (
            <AgreementFooter
              onPagination={false}
              onLeftButton={false}
              onRightButton={true}
              btnRightText={"Scan ID"}
              onClickBtnRightAction={barcodeCapture}
            />
          ) : (
            <AgreementFooter
              onPagination={false}
              onLeftButton={false}
              onRightButton={true}
              btnRightText={"Next"}
              onClickBtnRightAction={closeBCModal}
            />
          )}
        </div>
      ) : (
        <div
          className="id-detection-container_"
          style={{ position: "relative" }}
        >
          <>
            <AgreementHeader title="PROOF Identity Profile (PIP)" />
            <div
              style={{
                position: "relative",
                display: "flex",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <div className="camera-wrap-desktop">
                <div className="sub-item-2">
                  <h3 className="">PIP - Step 2</h3>
                  <br />
                  <p className="m-5">
                    Please position the rear side of your ID <br />
                  </p>
                  <br />
                  <Image
                    className="id-image-2"
                    src="/images/proof-identity-profile.svg"
                    alt="captured Image"
                    width={5000}
                    height={5000}
                    loading="lazy"
                  />
                  <br />
                    {showBCModalDesktop === false ?
                      ""
                      :
                      <p style={{ color: "red" }}>To get the best scan quality, use your smartphone by clicking <span style={{ color: 'green' }}><Link href={'/identity-profile/scan-qr'}>here</Link></span>.</p>

                    }
                  <p className="vid-text m-5">
                    Please ensure the barcode covers &gt; 70% of the screen.
                  </p>
                  {showFormButton && (
                    <>
                      <br />
                      <p style={{ color: "#009cf9" }}>
                        {showBCModalDesktop === false
                          ? "Too Tired to fill a form?"
                          : "Can't Scan ID Barcode?"}
                      </p>
                      <br />
                      <Button
                        blue
                        style={{ width: "12rem", height: "3rem" }}
                        onClick={() => handleOffScanner()}
                      >
                        {showBCModalDesktop === false
                          ? "Automatic Capture"
                          : "Manual Capture"}
                      </Button>
                    </>
                  )}
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
                  zIndex: "1000",
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
                        setShowBCModal(false)
                      }}
                    closeModal={closeBCModal}
                  />
                ) : (
                  <Scanner
                    show={true}
                    scanType="id"
                    barcodeUploaded={true}
                    step={2}
                    totalSteps={3}
                    recapture={() => setShowBCModal(false)}
                    closeModal={closeBCModal}
                  />
                )}
              </div>
              {/* Facilitates Manual Capture */}
              {!showForm && !showBCModalDesktop && (
                <div
                  style={{
                    background: "#000",
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "50%",
                    height: "100%",
                    zIndex: "10001",
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
                        />
                        <div
                          className={`id-card-frame-guide face-detected`}
                        ></div>
                      </div>
                      <div className="barcode-btns">
                        <Button
                          blue
                          style={{ width: "12rem", height: "3rem" }}
                          onClick={captureFrame}
                        >
                          <TbCapture /> Capture
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {capturedImage && !showBCModalDesktop && (
                        <div className="test-items-wrap-desktop_">
                          <div className="id-image">
                            <Image
                              className="img-border"
                              src={capturedImage}
                              alt="Captured Image"
                              layout="responsive"
                              width={500}
                              height={500}
                            />
                          </div>
                          <div className="barcode-btns">
                            <Button
                              white
                              style={{ width: "12rem", height: "3rem" }}
                              onClick={() => {
                                setCapturedImage(null);
                              }}
                            >
                              <TbCapture /> Recapture
                            </Button>
                            <Button
                              blue
                              style={{ width: "12rem", height: "3rem" }}
                              onClick={() => {
                                setShowForm(true);
                              }}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {showForm && !showBCModalDesktop && (
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "50%",
                    height: "100%",
                    zIndex: "10002",
                  }}
                >
                  <IDCardForm />
                </div>
              )}
            </div>
          </>
          {/* <DesktopFooter
                        onPagination={false}
                        onLeftButton={false}
                        onRightButton={true}
                        btnRightText={"Next"}
                        onClickBtnRightAction={closeBCModal}
                    /> */}

        </div>
      )}
    </>
  );
};

export default CameraBarcodeDetection;
