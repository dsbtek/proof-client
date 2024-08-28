"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { useDispatch, useSelector } from "react-redux";
import { preTestScreensData } from "@/redux/slices/pre-test";
import {
  AgreementHeader,
  AgreementFooter,
  Button,
  Header,
  DesktopFooter,
} from "@/components";
import { setSig } from "@/redux/slices/drugTest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useResponsive from "@/hooks/useResponsive";

interface PreTestScreen {
  Screen_1_Title: string;
  Screen_1_Content: string;
}

const SignaturePage = () => {
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [clearSignatureConfirmed, setClearSignatureConfirmed] = useState(false);
  const [sigCanvas, setSigCanvas] = useState<ReactSignatureCanvas | null>();
  const [sigCheck, setSigCheck] = useState(false);
  const [sigCanvasH, setSigCanvasH] = useState(0);
  const router = useRouter();
  const preTestScreens = useSelector(preTestScreensData) as PreTestScreen[];
  const isDesktop = useResponsive();
  const dispatch = useDispatch();

  const handleClearSignature = () => {
    setShowClearPrompt(true);
    setClearSignatureConfirmed(false);
  };

  const pathLink = (): string => {
    if (preTestScreens && preTestScreens.length > 0) {
      return "/pre-test-screens";
    }
    return "/test-collection/get-started";
  };
  const confirmClearSignature = () => {
    setClearSignatureConfirmed(true);
    setShowClearPrompt(false);
  };

  const clearSignature = useCallback(() => {
    sigCanvas?.clear();
  }, [sigCanvas]);

  const saveSignature = () => {
    if (sigCanvas) {
      if (sigCanvas.isEmpty()) {
        toast.error("Signature is required");
        return;
      }
      const sigData = sigCanvas.toDataURL();
      dispatch(setSig(sigData));
      setSigCheck(true);
      const linkPath = pathLink();
      router.push(linkPath);
    } else {
      console.error("Signature Canvas is not available");
    }
  };

  useEffect(() => {
    if (clearSignatureConfirmed) {
      clearSignature();
    }
  }, [clearSignature, clearSignatureConfirmed, sigCanvas]);

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      if (!isDesktop) {
        setSigCanvasH(250);
      } else {
        setSigCanvasH(680);
      }
    };
    routeBasedOnScreenSize();
  }, [isDesktop]);

  return (
    <div className="agreement-container">
      {showClearPrompt && (
        <div className="overLay">
          <div className="prompt">
            <div className="prompt-item">
              <p>Clear Signature</p>
              <p>Are you sure you want to clear the signature?</p>
            </div>
            <div className="prompt-btn">
              <Button
                classname="prompt-cancel-btn"
                onClick={() => setShowClearPrompt(false)}
              >
                Cancel
              </Button>
              <Button
                classname="prompt-yes-btn"
                onClick={confirmClearSignature}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
      <AgreementHeader title="Signature " />

      {/* <Header title="Signature" /> */}
      <div className="sign-items-wrap">
        <div
          className="signBg-with-img"
          style={{
            backgroundImage: !isDesktop ? 'url("../images/signBg.png")' : "",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {isDesktop ? (
            <p className="sign-text" style={{ textAlign: "left" }}>
              Please Sign in the white box in acceptance of <br /> the Agreement
              and Consent and press Next <br /> to continue.
            </p>
          ) : (
            <p className="sign-text">
              Please Sign in the white box in acceptance of the Agreement and
              Consent and press Next to continue.
            </p>
          )}
        </div>
        <div className="wrap-signature">
          <div style={{ width: "100%", height: "100%" }}>
            <SignatureCanvas
              ref={(data) => setSigCanvas(data)}
              penColor="#24527B"
              canvasProps={{
                width: 600,
                height: isDesktop ? "680px" : "250px",
                className: "sigCanvas",
              }}
            />
          </div>
        </div>
        <div className="signBg-with"></div>
      </div>
      {isDesktop ? (
        <DesktopFooter
          currentNumber={2}
          outOf={5}
          onPagination={true}
          onLeftButton={true}
          onRightButton={true}
          btnLeftLink={""}
          btnRightLink={!sigCheck ? "" : pathLink()}
          btnLeftText={"Clear"}
          btnRightText={"Next"}
          onClickBtnLeftAction={handleClearSignature}
          onClickBtnRightAction={!sigCheck ? saveSignature : () => {}}
        />
      ) : (
        <AgreementFooter
            currentNumber={2}
          outOf={5}
          onPagination={true}
          onLeftButton={true}
          onRightButton={true}
          btnLeftLink={""}
          btnRightLink={!sigCheck ? "" : pathLink()}
          btnLeftText={"Clear"}
          btnRightText={"Next"}
          onClickBtnLeftAction={handleClearSignature}
          onClickBtnRightAction={!sigCheck ? saveSignature : () => {}}
        />
      )}
    </div>
  );
};

export default SignaturePage;
