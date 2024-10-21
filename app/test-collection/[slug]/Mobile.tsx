import { AppHeader, Button, Scanner, Timer } from "@/components";
import { AiFillCloseCircle } from "react-icons/ai";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import Image from "next/image";
import React, { RefObject, useRef, useState } from "react";
import IScannner from "@/components/scanditize/IOSScanner";
type Props = {
  muteAudio: () => void;
  muted: boolean;
  handleDialog: () => void;
  showBCModal: boolean;
  scanType: string;
  barcodeUploaded: boolean;
  activeStep: number;
  test: any[];
  showTimer: boolean;
  time: number;
  isPlaying: boolean;
  toggleContent: boolean;
  barcodeStep: boolean;
  handleTimerEnd: () => void;
  reCaptureBarcode: () => void;
  closeBCModal: () => void;
  setToggleContent: (toggle: boolean) => void;
  repeatAudio: () => void;
  performLabelScan: boolean;
  handleNextStep: () => void;
  videoRef: any;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  isScanditDisabled: boolean;
};

const MobileTestView = ({
  muteAudio,
  muted,
  handleDialog,
  showBCModal,
  scanType,
  barcodeUploaded,
  activeStep,
  test,
  showTimer,

  time,
  isPlaying,
  toggleContent,
  barcodeStep,
  handleTimerEnd,
  reCaptureBarcode,
  closeBCModal,
  setToggleContent,
  repeatAudio,
  performLabelScan,
  handleNextStep,
  videoRef,
  isNextDisabled,
  isPrevDisabled,
  isScanditDisabled,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  const onClickCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      context!.drawImage(video, 0, 0);

      // Get the data URL of the canvas image
      const dataUrl = canvas.toDataURL("image/png");
      console.log(dataUrl, "dataurl image canvas");
      setImageSrc(dataUrl);
    }
  };
  const onClickRecapture = () => {
    setImageSrc("");
  };

  return (
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
        {isScanditDisabled ? (
          <IScannner
            show={showBCModal}
            scanType={scanType}
            barcodeUploaded={barcodeUploaded}
            step={activeStep}
            totalSteps={test.length}
            recapture={reCaptureBarcode}
            closeModal={closeBCModal}
            videoRef={videoRef}
            onClickCapture={onClickCapture}
            onClickReCapture={onClickRecapture}
          />
        ) : (
          <Scanner
            show={showBCModal}
            scanType={scanType}
            barcodeUploaded={barcodeUploaded}
            step={activeStep}
            totalSteps={test.length}
            recapture={reCaptureBarcode}
            closeModal={closeBCModal}
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="Screenshot"
            style={{
              position: "absolute",
              width: "70vw",
              height: "300px",
              zIndex: "9999",
              objectFit: "contain",
              left: "calc(50vw - 35vw)",
              top: "5.8rem",
            }}
            objectFit="contain"
          />
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          // height={400}
          // width={400}
          className="test-camera-container"
          // style={{ transform: [{ scaleX: -1 }] }}
          //screenshotFormat="image/png"
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
                      //   style={isPlaying ? { justifyContent: "center" } : {}}
                    >
                      <Button
                        disabled={isPrevDisabled}
                        classname="td-left"
                        onClick={repeatAudio}
                      >
                        Repeat
                      </Button>

                      <div className="double-btns">
                        <Button
                          classname={!toggleContent ? "db-blue" : "db-white"}
                          style={{
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                          }}
                          onClick={() => setToggleContent(false)}
                        >
                          Graphics
                        </Button>
                        <Button
                          classname={toggleContent ? "db-blue" : "db-white"}
                          style={{
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px",
                          }}
                          onClick={() => setToggleContent(true)}
                        >
                          Text
                        </Button>
                      </div>

                      <Button
                        classname="td-right"
                        disabled={isNextDisabled}
                        onClick={handleNextStep}
                      >
                        {showTimer ? "Wait..." : "Next"}
                      </Button>

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
  );
};
export default MobileTestView;
