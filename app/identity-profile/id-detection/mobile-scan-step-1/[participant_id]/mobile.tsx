import Webcam from "react-webcam";
import { RefObject, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AgreementFooter,
  IdTimer,
  PipDocTypeSelect,
  PipLoader,
  AppContainer,
  AppHeader,
  Button,
  Loader_,
} from "@/components";
import { useIDDetection } from "@/hooks/useIDDetection";
import { authToken } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import { BsInfoCircle } from "react-icons/bs";
import { TbCapture } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

const CameraIDCardDetectionMobile = ({
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
  const [facingMode, setFacingMode] = useState("environment");
  const { faceImage: image } = useIDDetection(
    participant_id as string,
    cameraRef
  );
  const [scan, setScan] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const params = usePathname();
  const sessionId = params.split("/").pop();
  const router = useRouter();
  const [face, setFace] = useState<string>("");
  const [capture, setCapture] = useState<string>("");





  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowManual(true);
  //   }, 30000);
  // }, []);

  const videoConstraints = {
    facingMode,
  };
  useEffect(() => {
    if (capturedImage && faceImage && !scan) {
      setCapture(capturedImage)
      setFace(faceImage)
      if (scan){return} else {handleScan(capturedImage, faceImage)}
    }
  }, [scan,capturedImage,faceImage]);
  
  const handleScan = useCallback(
    async (_capturedImage: any, _faceImage: any) => {
      try {
        const response = await fetch(
          `${baseUrl}/api/scan-barcode-mobile/submit-scan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data:{capturedImage: _capturedImage,faceImage:_faceImage},
              participantId: sessionId,
            }),
          }
        );
        if (!response.ok) {
          toast.error("Failed to send data");
        }
        toast.success("Data sent successfully");
        setScan(true)
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [baseUrl, sessionId]
  );

  // Get base URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
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
        header={<AppHeader title="PIP - Step 1" hasMute={false} />}
        body={
          <>
            <div className="test-items-wrap-desktop_">
              <div className="sub-item">
                {!capturedImage && (
                  <p className="vid-text">
                    Please position the front side of your ID <br />
                    in the camera frame below.
                  </p>
                )}
              </div>
              {errorMsg && !capturedImage && (
                <div
                  className="scan-with-mobile"
                  style={{
                    border: "1px solid #F59E0B",
                    backgroundColor: "#FEF3C7",
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    position: "absolute",
                    top: 0,
                    padding: "16px",
                  }}
                >
                  <BsInfoCircle color="#F59E0B" size={24} width={24} />
                  <p
                    style={{
                      color: "#0C1617",
                      fontSize: "14px",
                      fontWeight: "600px",
                    }}
                  >
                    {errorMsg}
                  </p>
                </div>
              )}
              {/* {showManual && !faceImage && (
                <Button
                  blue
                  style={{
                    width: "fit-content",
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
                    captureImage();
                  }}
                >
                  <TbCapture size={18} />
                  &nbsp;Capture
                </Button>
              )} */}
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
                      videoConstraints={videoConstraints}
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
                          {!socketConnected && <Loader_ />}
                          {manualEnabled && timeLeft && timeLeft > 0 && (
                            <IdTimer timeLeft={timeLeft} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <div className="face-image-wrap" style={{textWrap:"wrap"}}>
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
                          alt="Extracted face Image"
                          layout="responsive"
                          width={200}
                          height={200}
                        />
                      </div>
                    )}
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
          <AgreementFooter
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
                ? `${baseUrl}/identity-profile/id-detection/mobile-scan-step-2/${sessionId}`
                : undefined
            }
          />
        }
      />
    </>
  );
};

export default CameraIDCardDetectionMobile;
