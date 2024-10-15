"use client";
import { useState, useRef, useCallback, useEffect } from "react";
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
  Loader,
  Loader_,
  PipLoader,
  PipStepLoader,
} from "@/components";
import {
  setIDFront,
  setExtractedFaceImage,
  FacialCaptureString,
  setFacialCapture,
  setIdCardFacialPercentageScore,
} from "@/redux/slices/appConfig";
import { uploadFileToS3 } from "./action";
// import useFaceMesh from "@/hooks/faceMesh";
import { extractFaceImage } from "@/utils/utils";
import { authToken } from "@/redux/slices/auth";
import {
  setGovernmentID,
  setPassport,
  setProofID,
} from "@/redux/slices/drugTest";
import sharp from "sharp";
import path from "path";
import { compareFacesAI, extractFaceAI } from "@/utils/queries";
import { useRouter } from "next/navigation";
import PipDocTypeSelect from "@/components/pipDocTypeSelect";

// const usePermissions = () => {

//   return permissionsGranted;
// };

const CameraIDCardDetection = () => {
  const [sigCanvasH, setSigCanvasH] = useState(0);
  const { participant_id } = useSelector(authToken);
  const router = useRouter();

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 700) {
        setSigCanvasH(250);
      } else {
        setSigCanvasH(700);
      }
    };
    routeBasedOnScreenSize();
    window.addEventListener("resize", routeBasedOnScreenSize);
    return () => window.removeEventListener("resize", routeBasedOnScreenSize);
  }, []);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<boolean>(false);
  const [faces, setFaces] = useState<any[]>([]);
  // const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [isExtractingFace, setIsExtractingFace] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const cameraRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useDispatch();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [webcamKey, setWebcamKey] = useState(0);
  const facialCapture = useSelector(FacialCaptureString);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [isDocTypeVisible, setDocTypeVisible] = useState(false);
  const isDesktop = useResponsive();
  // const permissionsGranted = usePermissions();
  // const faceMesh = useFaceMesh();

  // const calculateBrightness = useCallback((imageData: { data: any }) => {
  //   const data = imageData.data;
  //   let totalBrightness = 0;

  //   for (let i = 0; i < data.length; i += 4) {
  //     const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
  //     totalBrightness += brightness;
  //   }

  //   const averageBrightness = totalBrightness / (data.length / 4);
  //   setBrightness(averageBrightness);
  // }, []);

  const extractFace = useCallback(async (imgBase64: string) => {
    setIsVisible(true);
    const extractedFaces = await extractFaceAI(imgBase64);

    if (extractedFaces.status === "complete") {
      setIsVisible(false);
      setLoaderVisible(true);
      return extractedFaces?.result;
    } else {
      toast.error("An error occurred extracting face");
    }
  }, []);

  // const checkForFace = useCallback(async () => {
  //   if (cameraRef.current) {
  //     const screenshot = cameraRef.current.getScreenshot();

  //     if (screenshot) {
  //       const img = new window.Image();
  //       img.src = screenshot;
  //       img.onload = async () => {
  //         const predictions = await faceMesh.predict(img);
  //         setFaces(predictions);
  //         setFaceDetected(predictions.length > 0);

  //         if (canvasRef.current) {
  //           const context = canvasRef.current.getContext("2d");
  //           if (context) {
  //             canvasRef.current.width = img.width;
  //             canvasRef.current.height = img.height;
  //             context.drawImage(img, 0, 0, img.width, img.height);
  //             const imageData = context.getImageData(
  //               0,
  //               0,
  //               img.width,
  //               img.height
  //             );
  //             calculateBrightness(imageData);
  //           }
  //         }
  //       };
  //     }
  //   }
  // }, [faceMesh, calculateBrightness]);

  // useEffect(() => {
  //   const interval = setInterval(checkForFace, 1000);
  //   return () => clearInterval(interval);
  // }, [checkForFace]);

  const captureFrame = useCallback(async () => {
    try {
      const dateNow = Date.now();
      const imageSrc = cameraRef?.current?.getScreenshot();
      const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;
      setCapturedImage(imageSrc as any);
      setIsExtractingFace(true);
      dispatch(setGovernmentID(idCapture));
      dispatch(setIDFront(imageSrc!));
      uploadFileToS3(imageSrc!, idCapture);

      const face = await extractFace(
        imageSrc!.replace(/^data:image\/\w+;base64,/, "")
      );

      if (face) {
        const faceBase64 = `data:image/png;base64,${face[0]}`;
        setFaceImage(faceBase64);
        setIsExtractingFace(false);
        dispatch(setExtractedFaceImage(faceBase64));
        const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
        const proofId = idCapture.split(".")[0];
        dispatch(setPassport(passportCapture));
        dispatch(setProofID(proofId));
        uploadFileToS3(faceBase64, passportCapture);
      }

      // if (imageSrc && faceMesh) {
      //   const img = new window.Image();
      //   img.src = imageSrc;
      //   img.onload = async () => {
      //     const predictions = await faceMesh.predict(img);
      //     const face = predictions[0];
      //     if (face) {
      //       const faceBase64 = extractFaceImage(img, face);
      //       if (faceBase64) {
      //         setFaceImage(faceBase64);
      //         dispatch(setIDFront(faceBase64));
      //         setIsExtractingFace(false);
      //         dispatch(setExtractedFaceImage(faceBase64));
      //         const passportCapture = `${participant_id}-PassportCapture-${Date.now()}.png`;
      //         const proofId = passportCapture.split(".")[0];
      //         dispatch(setPassport(passportCapture));
      //         dispatch(setProofID(proofId));
      //         await uploadFileToS3(faceBase64, passportCapture);
      //       } else {
      //         toast.error("Error extracting face image.");
      //         setIsExtractingFace(false);
      //       }
      //     } else {
      //       toast.error("No face detected. Please try again.");
      //       setIsExtractingFace(false);
      //     }
      //   };
      // }
    } catch (error) {
      toast.error("Error capturing image. Please try again.");
      setIsExtractingFace(false);
    }
  }, [dispatch, participant_id, extractFace]);

  const recaptureImage = () => {
    setCapturedImage(null);
    setFaceImage(null);
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setPermissionsGranted(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        toast.error(
          "Error accessing camera. Please allow camera access to continue."
        );
      }
    };

    checkPermissions();
  }, [webcamKey]);

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

  useEffect(() => {
    setDocTypeVisible(true);
  }, []);

  const handleLoaderClose = () => {
    setLoaderVisible(false);
  };

  const handleDocClose = () => {
    setDocTypeVisible(false);
  };

  return (
    <>
      <PipDocTypeSelect
        pipStep={1}
        isVisible={isDocTypeVisible}
        onClose={handleDocClose}
      />
      <PipLoader pipStep={1} isVisible={isVisible} />
      <PipStepLoader
        pipStep={1}
        isVisible={isLoaderVisible}
        onClose={handleLoaderClose}
      />

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
                    key={webcamKey}
                    className="camera"
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/png"
                    imageSmoothing={true}
                    mirrored
                  />

                  <div className={`id-card-frame-guide ${"face-detected"}`}>
                    {/* {brightness < 120 && (
                      <div className="brightness-detection">
                        <p>Insufficient light detected.</p>
                      </div>
                    )} */}
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
                  {/* {isExtractingFace && <Loader />} */}
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
                Please tap the `Next` button to move to step 3 <br /> where you
                will position the rear side of your ID.
              </p>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <AgreementFooter
            onPagination={false}
            // onLeftButton={faceImage ? true : false}
            onLeftButton={capturedImage ? true : false}
            onRightButton={true}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={recaptureImage}
            // btnRightText={faceImage ? "Next" : "Capture"}
            btnRightText={capturedImage ? "Next" : "Capture"}
            // onClickBtnRightAction={faceImage ? undefined : captureFrame}
            onClickBtnRightAction={capturedImage ? undefined : captureFrame}
            // rightdisabled={!faceDetected}
            rightdisabled={false}
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
              <h3 className="">PIP - 1</h3>
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
                  Please tap the `Next` button to move to step 3 where you will{" "}
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
                    mirrored
                  />

                  <div className={`id-card-frame-guide ${"face-detected"}`}>
                    {/* {brightness < 120 && (
                      <div className="brightness-detection">
                        <p>Insufficient light detected.</p>
                      </div>
                    )} */}
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
                    {/* {isExtractingFace && <Loader />} */}
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
                Please tap the `Next` button to move to step 1 <br /> where you
                will position the rear side of your ID.
              </p>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <DesktopFooter
            onPagination={false}
            onLeftButton={capturedImage ? true : false}
            onRightButton={true}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={recaptureImage}
            btnRightText={capturedImage ? "Next" : "Capture"}
            onClickBtnRightAction={capturedImage ? undefined : captureFrame}
            // rightdisabled={!faceDetected}
            rightdisabled={false}
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
