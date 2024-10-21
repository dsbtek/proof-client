import { AppHeaderDesktop, DesktopFooter, Scanner, Timer } from "@/components";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import Image from "next/image";
import React from "react";
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
  handleTimerEnd: () => void;
  reCaptureBarcode: () => void;
  closeBCModal: () => void;
  setToggleContent: (toggle: boolean) => void;
  repeatAudio: () => void;
  performLabelScan: boolean;
  handleNextStep: () => void;
  videoRef: any;
  kitName: string;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
};

const DesktopTestView = ({
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
  handleTimerEnd,
  reCaptureBarcode,
  closeBCModal,
  repeatAudio,
  handleNextStep,
  videoRef,
  isPrevDisabled,
  isNextDisabled,
  kitName,
}: Props) => {
  return (
    <>
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
          <AppHeaderDesktop handleDialog={handleDialog} title={kitName} />
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
          </div>
        </div>
      </div>
      ;
      <DesktopFooter
        currentNumber={activeStep}
        outOf={test.length}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink={""}
        btnRightLink={""}
        btnLeftText={"Repeat"}
        btnRightText={showTimer ? "Wait..." : "Next"}
        rightdisabled={isNextDisabled}
        leftdisabled={isPrevDisabled}
        onClickBtnLeftAction={repeatAudio}
        onClickBtnRightAction={handleNextStep}
        onProgressBar={true}
      />
    </>
  );
};
export default DesktopTestView;
