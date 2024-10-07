"use client";
import { useState, useRef, useCallback, useEffect, SetStateAction, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as ml5 from "ml5";
import Image from "next/image";
import Webcam from "react-webcam";
import useResponsive from "@/hooks/useResponsive";
import {
  AgreementFooter,
  AgreementHeader,
  Button,
  DesktopFooter,
  IdTimer,
  Loader,
  Loader_,
} from "@/components";
import { setIDFront, setExtractedFaceImage } from "@/redux/slices/appConfig";
import { uploadFileToS3 } from "./action";
import useFaceMesh from "@/hooks/faceMesh";
import { drawBoundingBox, extractFaceImage } from "@/utils/utils";
import { authToken } from "@/redux/slices/auth";
import {
  setGovernmentID,
  setPassport,
  setProofID,
} from "@/redux/slices/drugTest";
import usePermissions from "@/hooks/usePermissions";

const CameraIDCardDetection = () => {
  const { participant_id } = useSelector(authToken);
  const permissionsGranted = usePermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [faces, setFaces] = useState<any[]>([]);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [isExtractingFace, setIsExtractingFace] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const cameraRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countdown, setCountdown] = useState(20);
  const dispatch = useDispatch();
  const [drawBondingBox, setDrawBondingBox] = useState<boolean>(false);
  const isDesktop = useResponsive();
  const faceMesh = useFaceMesh();
  const boundingBox = useMemo(() => ({ x: 0.1, y: 0.1, width: 0.8, height: 0.5 }), []);


  const captureFaceImage = useCallback(async (face: any, img: HTMLImageElement, screenshot: SetStateAction<string | null>) => {
    const faceBase64 = extractFaceImage(img, face);
    const idCapture = `${participant_id}-IDCapture-${Date.now()}.png`;
    setCapturedImage(screenshot as any);
    setIsExtractingFace(true);
    dispatch(setGovernmentID(idCapture));
    dispatch(setIDFront(screenshot! as any));
    if (faceBase64) {
      setFaceImage(faceBase64);
      setIsExtractingFace(false);
      dispatch(setExtractedFaceImage(faceBase64));
      const passportCapture = `${participant_id}-PassportCapture-${Date.now()}.png`;
      const proofId = passportCapture.split(".")[0];
      dispatch(setPassport(passportCapture));
      dispatch(setProofID(proofId));
      await uploadFileToS3(screenshot! as any, idCapture);
      await uploadFileToS3(faceBase64, passportCapture);
    }
    setFaces([face]);
    setCapturedImage(screenshot);
  }, [participant_id, dispatch]);


  const checkForFace = useCallback(async () => {
    if (!cameraRef.current || !faceMesh) return;
    try {
      const screenshot = drawBoundingBox(canvasRef, cameraRef.current.video, boundingBox, drawBondingBox);
      if (!screenshot || typeof screenshot !== 'string') {
        console.warn("Screenshot is not valid:", screenshot);
        return;
      }
      const img = new window.Image();
      img.src = screenshot;
      img.onload = async () => {
        try {
          const predictions = await faceMesh.predict(img);
          if (predictions.length === 0) {
            setFaceDetected(false);
            return;
          }
          setFaceDetected(true);
          const face = predictions[0];
          console.log("Detected face:", face);
          startCountdown(() => captureFaceImage(face, img, screenshot));
        } catch (error) {
          console.error("Error during face prediction:", error);
        } finally {
          setIsExtractingFace(false);
        }
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        setIsExtractingFace(false);
      };
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      setIsExtractingFace(false);
    }
  }, [faceMesh, boundingBox, captureFaceImage, drawBondingBox]);


  const startCountdown = (onComplete: () => void) => {
    let interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 2000);
  };

  useEffect(() => {
    if (!faceImage) {
      const interval = setInterval(() => {
        checkForFace();
      }, 2000);

      return () => clearInterval(interval); // Cleanup
    }
  }, [faceImage, checkForFace]);

  const recaptureImage = () => {
    setCapturedImage(null);
    setFaceImage(null);
    setCountdown(20);
    setDrawBondingBox(false)
  };

  return (
    <>
      {!isDesktop ? (
        <div
          className="id-detection-container"
          style={{ position: "relative" }}
        >
          <AgreementHeader title="PIP - Step 1 " />
          <br />
          <div className="test-items-wrap-desktop_">
            <div className="sub-item">
              {!capturedImage && (
                <p className="vid-text">
                  Please position the front side of your ID <br />
                  in the camera frame below.
                </p>
              )}
            </div>

            <br />
            {permissionsGranted ? (
              !capturedImage ? (
                <div className="camera-container">
                  <Webcam
                    className="camera"
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/png"
                    imageSmoothing={true}
                  />
                  <div
                    className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"
                      }`}
                  >

                    <canvas className="canvas_" ref={canvasRef}>
                    </canvas>
                  </div>
                  <IdTimer />
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
                  {isExtractingFace && <Loader />}
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

          <br />
          {capturedImage && (
            <div>
              <p className="vid-text">
                Please tap the `Next` button to move to step 2 <br /> where you
                will position the rear side of your ID.
              </p>
            </div>
          )}
          {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}
          <AgreementFooter
            onPagination={false}
            onLeftButton={faceImage ? true : false}
            onRightButton={true}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={recaptureImage}
            btnRightText={capturedImage ? "Next" : "Capture"}
            onClickBtnRightAction={faceImage ? undefined : undefined}
            rightdisabled={!faceImage}
            btnRightLink={
              capturedImage
                ? "/identity-profile/id-detection/step-2"
                : undefined
            }
          />
        </div>
      ) : (
        <div
          className="id-detection-container_"
          style={{ position: "relative" }}
        >
          <AgreementHeader title="PROOF Identity Profile (PIP) " />
          {/* <br /> */}
          <div className="camera-items-wrap-desktop_">
            <div className="sub-item">
              <h3 className="">PIP - Step 1</h3>
              <br />
              {!capturedImage && (
                <p className="">
                  Please position the front side of your ID <br />
                  in the camera frame below.
                </p>
              )}
              {faceImage && (
                <p className="">
                  {" "}
                  Please tap the `Next` button to move to step 2 where you will{" "}
                  <br /> position the rear side of your ID. in the camera frame
                  below.
                </p>
              )}
            </div>

            {permissionsGranted ? (
              !capturedImage ? (
                <div className="camera-container">
                  <Webcam
                    className="camera"
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/png"
                    imageSmoothing={true}
                  />
                  <IdTimer />
                  <div
                    className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"
                      }`}
                  >
                    <canvas className="canvas_" ref={canvasRef}> </canvas>
                  </div>
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
                    {isExtractingFace && <Loader />}
                    {faceImage && (
                      // <div className="id-img_">
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
                      // </div>
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

          <br />
          {capturedImage && (
            <div>
              <p className="vid-text">
                Please tap the `Next` button to move to step 2 <br /> where you
                will position the rear side of your ID.
              </p>
            </div>
          )}
          {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}
          <DesktopFooter
            onPagination={false}
            onLeftButton={faceImage ? true : false}
            onRightButton={true}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={recaptureImage}
            btnRightText={capturedImage ? "Next" : "Capture"}
            onClickBtnRightAction={faceImage ? undefined : undefined}
            rightdisabled={!faceImage}
            btnRightLink={
              capturedImage
                ? "/identity-profile/id-detection/step-2"
                : undefined
            }
          />
        </div>
      )}
    </>
  );
};

export default CameraIDCardDetection;
