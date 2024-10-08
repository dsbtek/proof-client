"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import { RxSpeakerLoud } from "react-icons/rx";
import { AiFillCloseCircle } from "react-icons/ai";
import { GoMute } from "react-icons/go";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { BlobVideo, StreamVideo, useMediaCapture } from "react-media-capture";
import { toast } from "react-toastify";
import Crypto from "crypto-js";
import { TbCapture } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "react-query";
import useResponsive from "@/hooks/useResponsive";
import {
  AppHeader,
  Button,
  DialogBox,
  Timer,
  BarcodeCaptureModal,
  Alert,
  Loader_,
  Loader,
  Scanner,
  AgreementFooter,
  AgreementHeader,
  AppHeaderDesktop,
  DesktopFooter,
} from "@/components";
import {
  testData,
  setStartTime,
  setEndTime,
  saveTestClip,
  setUploadStatus,
  saveBarcode,
  saveConfirmationNo,
  setFilename,
  setTestSteps,
  setFaceScans,
} from "@/redux/slices/drugTest";
import {
  detectBarcodes,
  uploadVideoToS3,
  createPresignedUrl /*, videoEncoder */,
} from "./action";
import {
  base64ToBlob,
  base64ToFile,
  blobToBase64,
  blobToBuffer,
  blobToUint8Array,
  boldActionWords,
  dateTimeInstance,
  fileToBase64,
  getConnectionType,
} from "@/utils/utils";
import { storeBlobInIndexedDB } from "@/utils/indexedDB";
import { authToken } from "@/redux/slices/auth";
import usePageVisibility from "@/hooks/useVisibility";
import {
  FacialCaptureString,
  IdCardFacialPercentageScoreString,
  appData,
} from "@/redux/slices/appConfig";
import useFaceDetector from "@/hooks/faceDetector";
import {
  compareFacesAI,
  detectBarcodesAI,
  detectBarcodesAI2,
} from "@/utils/queries";
import useTestupload from "@/hooks/testUpload";
import { uploadFileToS3 } from "@/app/identity-profile/id-detection/step-1/action";
import { scoreMatrix } from "@/redux/slices/score-matrix";

function Test() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [toggleContent, setToggleContent] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [test, setTest] = useState<any>([]);
  const [timerStep, setTimerStep] = useState<number | null>(null);
  const [testStart, setTestStart] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [barcodeStep, setBarcodeStep] = useState<boolean>(false);
  const [showBCModal, setShowBCModal] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [barcodeIsLoading, setBarcodeIsLoading] = useState(false);
  const [barcodeImage, setBarcodeImage] = useState<string>("");
  const [scanType, setScanType] = useState<string>("test");
  const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
  const [performFaceScan, setPerformFaceScan] = useState<boolean>(false);
  const [performLabelScan, setPerformLabelScan] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const cameraRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const blobCount = useRef(0);
  const isFinal = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const uuid = useRef(uuidv4());
  const timeRef = useRef(0);
  const stepNameRef = useRef(0);
  const activeStepRef = useRef(activeStep);
  const timerStepRef = useRef<boolean>(false);
  const temperatureReaderRef = useRef(false);
  const faceScanRef = useRef(false);
  const barcodeStepRef = useRef(false);
  const labelScanRef = useRef(false);
  const AIOptions = useRef<any>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const {
    AIConfig,
    storage,
    lookAway,
    handsOut,
    testSteps,
    testStepsFiltered,
    timerObjs,
    testingKit,
    startTime,
    endTime,
    signature,
    confirmationNo,
    filename,
    trackingNumber,
    shippingLabel,
    barcodeKit,
    detectKit,
    proofId,
    faceCompare,
    faceScans,
    imageCaptures,
    passport,
    governmentID,
    idDetails,
  } = useSelector(testData);
  const { participant_id } = useSelector(authToken);
  const { first_name, last_name } = useSelector(appData);
  const facialCapture = useSelector(FacialCaptureString);
  const facialScanScore = useSelector(IdCardFacialPercentageScoreString);
  const feedbackData = useSelector(
    (state: any) => state.preTest.preTestFeedback
  );
  const scoringData = useSelector(scoreMatrix);
  const [webcamKey, setWebcamKey] = useState(0); // State to trigger re-render

  const isDesktop = useResponsive();
  const isVisible = usePageVisibility();
  const { faceDetected } = useFaceDetector(cameraRef);
  const { uploader, testUpload } = useTestupload();

  const {
    status,
    liveVideo,
    capturedVideo,
    devices,
    duration,
    volume,
    selectedDeviceId,
    lastError,

    record,
    pause,
    resume,
    stop,
    clear,
    selectDevice,
  } = useMediaCapture({ watchVolume: true });

  const endTest = useCallback(async () => {
    showDialog && setShowDialog(false);
    setIsSubmitting(true);
    isFinal.current = true;
    setMuted(true);
    dispatch(setEndTime(dateTimeInstance()));
    mediaRecorderRef.current?.stop();
    stop();
  }, [dispatch, showDialog, stop]);

  const handleDialog = useCallback(() => {
    setShowDialog(!showDialog);
  }, [showDialog]);

  // useEffect(() => {
  //   alert("cameraRef changed");
  // }, [cameraRef]);

  const handleNextStep = useCallback(() => {
    if (activeStep === test.length) {
      if (testingKit.Scan_Shipping_Label && !performLabelScan) {
        setPerformLabelScan(true);
      } else {
        endTest();
      }
    } else {
      //Logic helps timer step stay on track with the active step
      if (
        activeStep + 1 !== test[activeStep].step &&
        test[activeStep].step !== null &&
        activeStep === test[activeStep - 1].step
      ) {
        const newActiveStep = test[activeStep].step;
        setActiveStep(newActiveStep);
      } else if (time === 0 && timerStep !== activeStep) {
        const newActiveStep = activeStep + 1; //Needs to be set because useState is asynchronous and does not update before assigning the values below
        mediaRecorderRef.current?.stop();
        setActiveStep(newActiveStep);
        setTimeout(() => {
          timeRef.current = time;
          stepNameRef.current = test[newActiveStep - 1].step_name;
          activeStepRef.current = newActiveStep;
          timerStepRef.current = typeof timerStep === "number" ? true : false;
          temperatureReaderRef.current = test[newActiveStep - 1]
            .is_temperature_reader
            ? true
            : false;
          faceScanRef.current = performFaceScan ? true : false;
          barcodeStepRef.current = barcodeStep ? true : false;
          labelScanRef.current = performLabelScan ? true : false;
          AIOptions.current = test[newActiveStep - 1].ai_options;
        }, 1000);
      } else {
        setShowTimer(true);
      }
    }
  }, [
    activeStep,
    barcodeStep,
    endTest,
    performFaceScan,
    performLabelScan,
    test,
    testingKit.Scan_Shipping_Label,
    time,
    timerStep,
  ]);

  const handleTimerEnd = useCallback(async () => {
    setShowTimer(false);
    setTime(0);
    setTimerStep(null);
    mediaRecorderRef.current?.stop();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const newActiveStep = activeStep + 1;
    setTimeout(() => {
      timeRef.current = time;
      stepNameRef.current = test[newActiveStep - 1].step_name;
      activeStepRef.current = newActiveStep;
      timerStepRef.current = typeof timerStep === "number" ? true : false;
      temperatureReaderRef.current = test[newActiveStep - 1]
        .is_temperature_reader
        ? true
        : false;
      faceScanRef.current = performFaceScan ? true : false;
      barcodeStepRef.current = barcodeStep ? true : false;
      labelScanRef.current = performLabelScan ? true : false;
      AIOptions.current = test[newActiveStep - 1].ai_options;
    }, 1000);
  }, [
    activeStep,
    barcodeStep,
    performFaceScan,
    performLabelScan,
    test,
    time,
    timerStep,
  ]);

  const muteAudio = () => {
    setMuted(!muted);
  };

  const repeatAudio = () => {
    const audio = document.getElementById("test-audio") as HTMLAudioElement;
    audio?.load();
  };

  const closeBCModal = () => {
    setBarcodeStep(false);
    setShowBCModal(false);
    setBarcodeUploaded(false);
    handleNextStep();
    // alert("here");
    setWebcamKey((p) => p + 1);
  };

  const barcodeCapture = useCallback(async () => {
    try {
      setBarcodeIsLoading(true);
      const imageSrc = cameraRef?.current!.getScreenshot();
      setBarcodeImage(imageSrc!);

      barcodeStep && setScanType("test");
      performLabelScan && setScanType("fedex");
      if (performLabelScan) {
        setScanType("fedex");
        const shippingLabelCapture = `${participant_id}-ShippingLabelCapture-${Date.now()}.png`;
        uploadFileToS3(imageSrc!, shippingLabelCapture).catch((error) => {
          console.error("Shipping Label Capture Upload Error:", error);
        });
      }

      setBarcodeUploaded(true);

      setBarcodeIsLoading(false);
      setShowBCModal(true);
    } catch (error) {
      setBarcodeIsLoading(false);
      toast.error("Error detecting barcode. Please try again.");
      console.error("Barcode Capture Error:", error);
    }
  }, [barcodeStep, participant_id, performLabelScan]);

  const reCaptureBarcode = () => {
    setBarcode("");
    setShowBCModal(false);
    setBarcodeUploaded(false);
  };

  //Performs security and integrity checks
  useEffect(() => {
    if (performFaceScan) {
      const faceScan = cameraRef?.current!.getScreenshot();
      const facialScan = `${participant_id}-FacialScan-${Date.now()}.png`;
      (async () => {
        try {
          const similarity = await compareFacesAI(
            facialCapture.replace(/^data:image\/\w+;base64,/, ""),
            faceScan!.replace(/^data:image\/\w+;base64,/, "")
          );
          console.log("simi in test-->", similarity.result.percentage);
          await uploadFileToS3(faceScan!, facialScan).catch((error) => {
            console.error("Facial Scan Upload Error:", error);
          });
          dispatch(
            setFaceScans({
              url: facialScan,
              percentage: similarity.result.percentage,
            })
          );
          setPerformFaceScan(false);
        } catch (error) {
          console.error("Test Face Compare Error:", error);
        }
      })();
    }

    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/user-notif.mp3");
    }

    if (faceDetected && isVisible && status !== "acquiring") {
      audioRef.current.loop = false;
      audioRef.current.pause();
    } else {
      if (barcodeStep) return;
      audioRef.current.loop = true;
      audioRef.current.play();
    }

    // Cleanup function to pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [
    barcodeStep,
    dispatch,
    faceDetected,
    facialCapture,
    isVisible,
    participant_id,
    performFaceScan,
    status,
    testingKit.Scan_Shipping_Label,
  ]);

  //General Test Collection functions and logic
  useEffect(() => {
    testStepsFiltered.length > 0
      ? setTest(testStepsFiltered)
      : setTest(testSteps);

    // Ensures the first stream chunk has data
    if (test[0] && test[0].step === activeStep) {
      timeRef.current = time;
      stepNameRef.current = test[0].step_name;
      activeStepRef.current = test[0].step;
      timerStepRef.current = typeof timerStep === "number" ? true : false;
      temperatureReaderRef.current = test[activeStep - 1].is_temperature_reader
        ? true
        : false;
      faceScanRef.current = performFaceScan ? true : false;
      barcodeStepRef.current = barcodeStep ? true : false;
      labelScanRef.current = performLabelScan ? true : false;
      AIOptions.current = test[0].ai_options;

      dispatch(
        setFilename(
          `${participant_id}-${testingKit.kit_name.split(" ").join("-")}-${
            testingKit.kit_id
          }-${uuid.current}.mp4`
        )
      );
    }

    // Start recording the video
    record();

    if (testStart) {
      dispatch(setStartTime(dateTimeInstance()));
      setTestStart(false);
    }

    // Checks if the timer will be active
    if (timerObjs.length > 0 && time === 0 && status !== "acquiring") {
      timerObjs.map((timerObj) => {
        if (timerObj.after_step === activeStep) {
          setTimerStep(timerObj.after_step);
          setTime(timerObj.step_time);
        }
      });
    }

    // Checks if the audio has ended to activate the timer
    if (!showTimer && activeStep === timerStep) {
      const audio = document.getElementById("test-audio") as HTMLAudioElement;
      audio.addEventListener("ended", () => {
        setShowTimer(true);
      });
    }

    //Checks for actions to be performed during the testing process
    if (test.length > 0 && status !== "acquiring") {
      const barcodeCapture = test[activeStep - 1].is_barcode;
      barcodeCapture && setBarcodeStep(true);

      const faceScan = test[activeStep - 1].is_scan_face;
      faceScan && !performFaceScan && setPerformFaceScan(true);
    }

    const handlePendingTest = async () => {
      const blobId = await storeBlobInIndexedDB(
        capturedVideo.blob,
        participant_id as string
      );

      if (typeof window !== "undefined") {
        const testPending = {
          kit: testingKit,
          startTime: startTime,
          endTime: endTime,
          id: blobId,
          filename: filename,
          barcode: barcode,
          storage: storage,
          lookAway: lookAway,
          handsOut: handsOut,
          trackingNumber: trackingNumber,
          shippingLabel: shippingLabel,
          barcodeKit: barcodeKit,
          detectKit: detectKit,
          proofId: proofId,
          faceCompare: faceCompare,
          faceScans: faceScans,
          imageCaptures: imageCaptures,
          passport: passport,
          governmentID: governmentID,
          idDetails: idDetails,
        };
        const encryptedpendingTest = Crypto.AES.encrypt(
          JSON.stringify(testPending),
          process.env.NEXT_PUBLIC_SECRET_KEY as string
        ).toString();
        localStorage.setItem("pendingTest", encryptedpendingTest);
      }

      dispatch(setUploadStatus(undefined));
    };

    // Saves, processes and uploads the video/test results to the server
    if (status === "recorded" && capturedVideo.blob) {
      // Self invoking function to upload the video to S3
      (async () => {
        try {
          if (process.env.NODE_ENV !== "development") {
            dispatch(setUploadStatus(true));
            await uploader(capturedVideo.blob, handlePendingTest);
          } else {
            const formData = new FormData();
            formData.append("video", capturedVideo.blob, "video.mp4");
            dispatch(setUploadStatus(true));

            await testUpload();

            await uploadVideoToS3(formData, `dev-${filename}.mp4`)
              .then((response) => {
                if (response["$metadata"].httpStatusCode === 200) {
                  dispatch(setUploadStatus(false));
                } else {
                  handlePendingTest();
                  toast.error("Error uploading video");
                }
              })
              .catch((error) => {
                handlePendingTest();
                console.error("S3 Upload Error:", error);
              });
          }
        } catch (error) {
          handlePendingTest();
          console.error("Upload error:", error);
        }
      })();

      const url = URL.createObjectURL(capturedVideo.blob);
      dispatch(saveTestClip(url));
      setIsSubmitting(false);

      if (feedbackData && feedbackData.length > 0) {
        router.push("/feedback");
      } else {
        router.push("/test-collection/collection-summary");
      }
    }

    // Handle audio play and end events to show/hide buttons
    const audio = document.getElementById("test-audio") as HTMLAudioElement;
    const handleAudioPlay = () => setIsPlaying(true);
    const handleAudioEnd = () => setIsPlaying(false);

    audio?.addEventListener("playing", handleAudioPlay);
    audio?.addEventListener("ended", handleAudioEnd);

    //Checks if the browser was closed or the tab was closed
    function beforeUnloadHandler(event: BeforeUnloadEvent) {
      event.preventDefault();
      handleDialog();
    }

    if (
      status === "error" ||
      (status === "recording" &&
        pathname === `/test-collection/${testingKit.kit_id}`)
    ) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
    }

    return () => {
      audio?.removeEventListener("playing", handleAudioPlay);
      audio?.removeEventListener("ended", handleAudioEnd);
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [
    activeStep,
    barcode,
    barcodeKit,
    barcodeStep,
    cameraRef,
    capturedVideo,
    detectKit,
    dispatch,
    endTest,
    endTime,
    faceCompare,
    faceScans,
    feedbackData,
    filename,
    governmentID,
    handleDialog,
    handsOut,
    idDetails,
    imageCaptures,
    isFinal,
    lookAway,
    participant_id,
    passport,
    pathname,
    performFaceScan,
    performLabelScan,
    proofId,
    record,
    router,
    shippingLabel,
    showTimer,
    startTime,
    status,
    storage,
    test,
    testStart,
    testSteps,
    testStepsFiltered,
    testUpload,
    testingKit,
    testingKit.kit_id,
    time,
    timerObjs,
    timerStep,
    trackingNumber,
    uploader,
  ]);

  //Streams the video to the AI detection service
  useEffect(() => {
    const handleStreaming = async () => {
      // Check if the camera stream exists
      console.log(cameraRef?.current?.stream, "cameraRef stream");
      if (
        cameraRef?.current?.stream !== undefined &&
        cameraRef?.current?.stream !== null
      ) {
        // alert("entered the if block");
        // If there's an existing MediaRecorder, stop it and remove the event listener
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.removeEventListener(
            "dataavailable",
            handleDataAvailable
          );
        }

        // Get the current video stream
        const stream = cameraRef.current.stream;

        // Check if the stream already has an audio track, if not, add one
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // alert("got mic passed");
        const combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        // alert("combine video and audio stream passed");
        // Create a new MediaRecorder instance with both video and audio tracks
        // mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        //   mimeType: "video/webm;codecs=vp8,opus", // Include both video and audio codecs
        //   audioBitsPerSecond: 128000,
        //   videoBitsPerSecond: 2500000,
        // });
        // const isMimeTypeSupported = MediaRecorder.isTypeSupported(
        //   "video/webm;codecs=vp8,opus"
        // );
        // if (!isMimeTypeSupported) {
        //   alert("The MIME type is not supported on this device.");
        //   return; // or fallback to a different MIME type
        // }

        // check to see what mimeType is supported on ios and across all devices
        // const mimeTypesToCheck = [
        //   "video/mp4",
        //   "video/webm; codecs=vp8",
        //   "video/webm; codecs=vp9",
        //   "video/webm; codecs=opus",
        //   "video/mp4; codecs=h264",
        // ];

        // mimeTypesToCheck.forEach((mimeType) => {
        //   if (MediaRecorder.isTypeSupported(mimeType)) {
        //     alert(`${mimeType} is supported`);
        //   } else {
        //     alert(`${mimeType} is NOT supported`);
        //   }
        // });

        try {
          mediaRecorderRef.current = new MediaRecorder(combinedStream, {
            mimeType: "video/mp4; codecs=avc1.64001e, mp4a.40.2",
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
          });
          //   alert("media Recorder created successfully");
          //   alert("media Recorder arrive");
          // Add the dataavailable event listener
          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
          );
          //   alert("added media listener");

          // Start recording
          mediaRecorderRef.current.start(30000); // 30 seconds chunks
        } catch (error: any) {
          // alert("Failed to create MediaRecorder: " + error.message);
          console.error("MediaRecorder error:", error);
        }
      }
    };

    const handleDataAvailable = async ({ data }: BlobEvent) => {
      try {
        if (data.size > 0) {
          console.log("stream data--->", data);
          // Stop the MediaRecorder and starts a new one, to maintain the stream data integrity
          if (isFinal.current === false) {
            handleStreaming();
          }

          const unencodedString = await blobToBase64(data);
          console.log("as:", activeStep);
          const body = JSON.stringify({
            inference_config: AIConfig,
            inference_score: scoringData[testingKit.kit_id],
            chunks: unencodedString,
            test_type: `${testingKit.kit_id}`,
            video_path: "",
            record: filename,
            index: blobCount.current,
            is_final: isFinal.current ? true : false,
            step: {
              step_time: timeRef.current,
              step_name: stepNameRef.current,
              step: activeStepRef.current,
              is_timed: timerStepRef.current,
              is_temperature_reader: temperatureReaderRef.current,
              is_scan_face: faceScanRef.current,
              is_barcode: barcodeStepRef.current,
              shippinglabel: labelScanRef.current,
              ai_options: AIOptions.current,
            },
          });

          //Indexs the blob chunks being sent
          blobCount.current += 1;

          // Send data to the AI server
          const response = await fetch(`${process.env.NEXT_PUBLIC_BEAM_URL}`, {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
              "Content-Type": "application/json",
              Connection: "keep-alive",
            },
            body: body,
          });

          const analysis_data = await response.json();
          console.log("beam response:", analysis_data);

          if (!response.ok) {
            console.error(`Beam Server Error: ${response}`);
          }

          if (response.ok) {
            if (analysis_data.status === "error") {
              isFinal.current = true;
              mediaRecorderRef.current?.stop();
              return;
            }

            // if (analysis_data.status === 'pending' && !isFinal.current) {
            //     toast.info('AI detecting...');
            // }

            if (typeof analysis_data.task_id === "string" && !isFinal.current) {
              toast.info("AI detecting...");
            }

            if (analysis_data.status === "success") {
              if (analysis_data.data) {
                const sendMail = async () => {
                  const response = await fetch("/api/send-email", {
                    method: "POST",
                    body: JSON.stringify({
                      config: AIConfig,
                      participant_id: participant_id,
                      date: endTime,
                      kit: testingKit.kit_name,
                      confirmation_no: confirmationNo,
                      videoLink: `https://proofdata.s3.amazonaws.com/${filename}`,
                      face_scan_score: facialScanScore,
                      detections: analysis_data.data,
                    }),
                  });
                  const data = await response.json();
                  console.log("sm data:", data);
                };
                await sendMail();
                toast.success("AI detection complete!");
              }
            }
            console.log("stream count:", blobCount.current);
          }
        }
      } catch (error) {
        console.error("Stream Data Error :", error);
      }
    };

    //Activate streaming
    if (status === "previewing") {
      handleStreaming().catch((error) => {
        toast.error(
          "Error streaming video, results maybe delayed. Contact support."
        );
        console.error("Stream Error:", error);
      });
    }
  }, [
    AIConfig,
    activeStep,
    barcodeStep,
    cameraRef,
    confirmationNo,
    dispatch,
    endTime,
    facialScanScore,
    filename,
    isFinal,
    participant_id,
    performFaceScan,
    performLabelScan,
    scoringData,
    status,
    test,
    testingKit.kit_id,
    testingKit.kit_name,
    time,
    timerStep,
  ]);

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

  return (
    <>
      {isSubmitting && <Loader />}
      <DialogBox
        show={showDialog}
        handleReject={handleDialog}
        handleAccept={endTest}
        title="End Test"
        content2="Are you sure you want to end your test?"
        content1="WARNING: Ending the test before the final step will result in a failed test."
        rejectText="No"
        acceptText="Yes"
      />
      <div className="test-container">
        {status !== "acquiring" && !barcodeStep && !performLabelScan && (
          <Alert show={faceDetected} />
        )}
        {!isDesktop ? (
          <div style={{ height: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "10%",
                padding: "16px",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: "1000",
                backgroundColor: "white",
              }}
            >
              <AppHeader /*title={testingKit.kit_name} */ title="" />
              <div className="test-audio">
                {muted ? (
                  <GoMute
                    onClick={muteAudio}
                    color="#adadad"
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <RxSpeakerLoud
                    onClick={muteAudio}
                    color="#009cf9"
                    style={{ cursor: "pointer" }}
                  />
                )}
                <AiFillCloseCircle
                  color="red"
                  onClick={handleDialog}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="test-content">
              <Scanner
                show={showBCModal}
                scanType={scanType}
                barcodeUploaded={barcodeUploaded}
                step={activeStep}
                totalSteps={test.length}
                recapture={reCaptureBarcode}
                closeModal={closeBCModal}
              />
              <Webcam
                key={webcamKey}
                className="test-camera-container"
                ref={cameraRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={{
                  facingMode: "user",
                }}
                imageSmoothing={true}
                mirrored
              />
              <div className="test-details">
                {test.map((step: any, index: number) => {
                  if (activeStep === step.step && step.step !== null) {
                    return (
                      <React.Fragment key={index}>
                        <div className="test-header" key={index + 1}>
                          <p className="test-steps">{`Step ${step.step} of ${test.length}`}</p>
                          <div
                            className="td-btns"
                            style={
                              isPlaying ? { justifyContent: "center" } : {}
                            }
                          >
                            {!isPlaying && (
                              <Button classname="td-left" onClick={repeatAudio}>
                                Repeat
                              </Button>
                            )}
                            <div className="double-btns">
                              <Button
                                classname={
                                  !toggleContent ? "db-blue" : "db-white"
                                }
                                style={{
                                  borderTopLeftRadius: "8px",
                                  borderBottomLeftRadius: "8px",
                                }}
                                onClick={() => setToggleContent(false)}
                              >
                                Graphics
                              </Button>
                              <Button
                                classname={
                                  toggleContent ? "db-blue" : "db-white"
                                }
                                style={{
                                  borderTopRightRadius: "8px",
                                  borderBottomRightRadius: "8px",
                                }}
                                onClick={() => setToggleContent(true)}
                              >
                                Text
                              </Button>
                            </div>
                            {!isPlaying &&
                              !barcodeStep &&
                              !performLabelScan && (
                                <Button
                                  classname="td-right"
                                  onClick={handleNextStep}
                                >
                                  {showTimer ? "Wait..." : "Next"}
                                </Button>
                              )}
                            {(!isPlaying && barcodeStep) ||
                              (performLabelScan && (
                                <div
                                  style={{ width: "100%", maxWidth: "85px" }}
                                ></div>
                              ))}
                          </div>
                        </div>
                        <div style={{ position: "relative" }} key={index + 2}>
                          {!toggleContent ? (
                            <Image
                              className="test-graphic"
                              src={step.image_path}
                              alt="Proof Test Image"
                              width={5000}
                              height={5000}
                              priority
                              unoptimized
                              placeholder="blur"
                              blurDataURL="image/png"
                            />
                          ) : (
                            <div className="test-text">
                              <article className="test-step">
                                <h5>{step.step}</h5>
                              </article>
                              <p className="t-text">{step.directions}</p>
                            </div>
                          )}
                          {showTimer && (
                            <Timer
                              time={time}
                              showTimer={showTimer}
                              handleEnd={handleTimerEnd}
                            />
                          )}
                        </div>
                        <audio
                          key={index + 3}
                          id="test-audio"
                          src={step.audio_path}
                          controls
                          autoPlay
                          muted={muted}
                          style={{ display: "none" }}
                        />
                      </React.Fragment>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="test-content">
            {showBCModal && (
              <div
                className="desktop-scanner" /*style={{ position: 'absolute', right: '0', top: "100px", width: '50%', height: '78.5%', zIndex: '1000' }}*/
              >
                <Scanner
                  show={showBCModal}
                  scanType={scanType}
                  barcodeUploaded={barcodeUploaded}
                  step={activeStep}
                  totalSteps={test.length}
                  recapture={reCaptureBarcode}
                  closeModal={closeBCModal}
                />
              </div>
            )}
            <div className="test-head">
              <AppHeaderDesktop
                handleDialog={handleDialog}
                title={testingKit.kit_name}
              />
              <div className="test-audio">
                {muted ? (
                  <GoMute
                    onClick={muteAudio}
                    color="#adadad"
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <RxSpeakerLoud
                    onClick={muteAudio}
                    color="#009cf9"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
            <div className="wrap-content-cam">
              <div className="test-details">
                {test.map((step: any, index: number) => {
                  if (activeStep === step.step && step.step !== null) {
                    return (
                      <React.Fragment key={index}>
                        <div
                          className="test-graphic_"
                          key={index + 2}
                          style={{ position: "relative" }}
                        >
                          <div className="test-text">
                            <article className="test-step_">
                              <h5>Step {step.step}</h5>
                            </article>
                            <p className="t-text">{step.directions}</p>
                          </div>
                          <Image
                            className="test-graphic"
                            src={step.image_path}
                            alt="Proof Test Image"
                            width={5000}
                            height={5000}
                            priority
                            unoptimized
                            placeholder="blur"
                            blurDataURL="image/png"
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              height: "100%",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {showTimer && (
                              <Timer
                                time={time}
                                showTimer={showTimer}
                                handleEnd={handleTimerEnd}
                              />
                            )}
                          </div>
                        </div>
                        <audio
                          key={index + 3}
                          id="test-audio"
                          src={step.audio_path}
                          controls
                          autoPlay
                          muted={muted}
                          style={{ display: "none" }}
                        />
                      </React.Fragment>
                    );
                  }
                })}
              </div>
              <div className="camera-container">
                <Webcam
                  key={webcamKey}
                  className="test-camera-container"
                  ref={cameraRef}
                  audio={false}
                  screenshotFormat="image/png"
                  videoConstraints={{
                    facingMode: "user",
                  }}
                  imageSmoothing={true}
                  mirrored
                />
              </div>
            </div>
          </div>
        )}
        {isDesktop && (
          <DesktopFooter
            currentNumber={activeStep}
            outOf={test.length}
            onPagination={true}
            onLeftButton={!isPlaying}
            onRightButton={!isPlaying && !barcodeStep && !performLabelScan}
            btnLeftLink={""}
            btnRightLink={""}
            btnLeftText={"Repeat"}
            btnRightText={showTimer ? "Wait..." : "Next"}
            rightdisabled={false}
            onClickBtnLeftAction={repeatAudio}
            onClickBtnRightAction={handleNextStep}
            onProgressBar={true}
          />
        )}
        {barcodeStep && !barcodeUploaded && (
          <div className="barcode-btns">
            {barcodeIsLoading ? (
              <Loader_ />
            ) : (
              <Button classname="cap-btn" onClick={barcodeCapture}>
                <TbCapture /> Capture
              </Button>
            )}
          </div>
        )}
        {performLabelScan && !barcodeUploaded && (
          <div className="barcode-btns">
            {barcodeIsLoading ? (
              <Loader_ />
            ) : (
              <Button classname="cap-btn" onClick={barcodeCapture}>
                <TbCapture /> Capture
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Test;
