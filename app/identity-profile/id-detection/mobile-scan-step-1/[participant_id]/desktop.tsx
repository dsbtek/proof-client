import Webcam from "react-webcam";
import { RefObject, useEffect, useState } from "react";
import Image from "next/image";
import {
  AgreementHeader,
  IdTimer,
  PipDocTypeSelect,
  PipLoader,
  PipStepLoader,
  Loader_,
  DesktopFooter,
  AppContainer,
  AppHeader,
  Loader,
  Button,
} from "@/components";
import "../../../../../components/modals/modal.css";
import { useSelector } from "react-redux";
import { authToken } from "@/redux/slices/auth";
import { useIDDetection } from "@/hooks/useIDDetection";
import { BsInfoCircle } from "react-icons/bs";
import { TbCapture } from "react-icons/tb";

interface CameraIDCardDetectionProps {
  permissionsGranted: boolean;
  capturedImage: string | null;
  faceImage: string | null;
  timeLeft?: number;
  isLoading: boolean;
  isDocTypeVisible: boolean;
  isVisible: boolean;
  isLoaderVisible: boolean;
  handleDocClose: () => void;
  handleManualCapture: () => void;
  handleLoaderClose: () => void;
  recaptureImage: () => void;
  recaptureManualImage: () => void;
  captureFrame: () => void;
  cameraRef: RefObject<Webcam>;
  canvasRef: RefObject<HTMLCanvasElement>;
  webcamKey: number;
  socketConnected?: boolean;
  errorMsg?: string;
}

const CameraIDCardDetectionDesktop = ({
  permissionsGranted,
  capturedImage,
  faceImage,
  timeLeft,
  isLoading,
  isDocTypeVisible,
  isVisible,
  isLoaderVisible,
  handleDocClose,
  handleLoaderClose,
  recaptureImage,
  recaptureManualImage,
  captureFrame,
  cameraRef,
  canvasRef,
  webcamKey,
  socketConnected,
  errorMsg,
  handleManualCapture,
}: CameraIDCardDetectionProps) => {
  const { participant_id } = useSelector(authToken);
  const [showManual, setShowManual] = useState<boolean>(false);
  const [manualEnabled, setManualEnabled] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowManual(true);
    }, 30000);
  }, []);
  return (
    <>
      <PipDocTypeSelect
        pipStep={1}
        isVisible={isDocTypeVisible}
        onClose={handleDocClose}
      />
      <PipLoader pipStep={1} isVisible={isVisible} />
      <AppContainer
        header={
          <AppHeader title="PROOF Identity Profile (PIP)" hasMute={false} />
        }
        body={
          <>
            <div className="camera-items-wrap-desktop_">
              <div className="sub-item">
                <div style={{ minHeight: "10px" }}>
                  <h3>PIP - Step 1</h3>
                  <br />
                  {!capturedImage && (
                    <p className="with-bullet">
                      Please position the front side of your ID <br />
                      in the camera frame below.
                    </p>
                  )}
                  {faceImage && (
                    <p className="with-bullet">
                      Please tap the `Next` button to move to step 2 <br />
                      where you will position the rear side of your ID.
                    </p>
                  )}
                  {errorMsg && !faceImage && (
                    <div
                      className="scan-with-mobile"
                      style={{
                        border: "1px solid #F59E0B",
                        backgroundColor: "#FEF3C7",
                      }}
                    >
                      <BsInfoCircle color="#F59E0B" size={32} />

                      <p
                        style={{
                          color: "#0C1617",
                          fontSize: "16px",
                          fontWeight: "600px",
                          lineHeight: "20px",
                        }}
                      >
                        {errorMsg}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {permissionsGranted ? (
                !capturedImage ? (
                  <div className="camera-container">
                    <Webcam
                      key={webcamKey}
                      className="camera"
                      ref={cameraRef}
                      audio={false}
                      screenshotFormat="image/png"
                      imageSmoothing={true}
                      mirrored
                      style={{
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "16px",
                      }}
                    />
                    {/* <div
                        className={`id-card-frame-guide ${
                          socketConnected && "face-detected"
                        }`}
                      >
                        {!socketConnected && <Loader_ />}
                        {manualEnabled && timeLeft && timeLeft > 0 && (
                          <IdTimer timeLeft={timeLeft} />
                        )}
                      </div> */}
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
                          {!socketConnected && <Loader_ />}
                          {manualEnabled && timeLeft && timeLeft > 0 && (
                            <IdTimer timeLeft={timeLeft} />
                          )}
                        </div>
                      </div>
                    </div>
                    {showManual && (
                      <Button
                        blue
                        style={{
                          width: "fit-content",
                          // padding: "12px 36px",
                          height: "48px",
                          borderRadius: "12px",
                          textWrap: "nowrap",
                          fontSize: "1rem",
                          position: "absolute",
                          bottom: "10%",
                          zIndex: 999,
                        }}
                        onClick={() => {
                          setManualEnabled(true);
                          handleManualCapture();
                        }}
                      >
                        <TbCapture size={18} />
                        &nbsp;Capture
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="id-img_"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {capturedImage && (
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
                      )}
                      {faceImage && (
                        <div className="face-image-wrap">
                          <p
                            className="vid-text"
                            style={{
                              color: "#009cf9",
                              marginBottom: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Extracted ID Face
                          </p>
                          <Image
                            className="face-image"
                            src={faceImage}
                            alt="Extracted Face Image"
                            layout="responsive"
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )
              ) : (
                <>
                  <p className="vid-text">
                    Camera access is not granted. Please allow camera access to
                    continue.
                  </p>
                  <Loader_ />
                </>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        }
        footer={
          <DesktopFooter
            onPagination={false}
            onLeftButton={!!capturedImage}
            onRightButton={true}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={() => {
              recaptureImage();
              recaptureManualImage();
            }}
            btnRightText={"Next"}
            onClickBtnRightAction={capturedImage ? undefined : captureFrame}
            rightdisabled={!faceImage}
            btnRightLink={
              capturedImage
                ? "/identity-profile/id-detection/step-2"
                : undefined
            }
          />
        }
      />
    </>
  );
};

export default CameraIDCardDetectionDesktop;
