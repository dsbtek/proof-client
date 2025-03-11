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
  AppContainer,
  AppHeader,
} from "@/components";
import { setSig } from "@/redux/slices/drugTest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useResponsive from "@/hooks/useResponsive";
import { authToken } from "@/redux/slices/auth";
import { uploadImagesToS3 } from "@/app/identity-profile/id-detection/step-1/action";
import { preTestTotalSteps_ } from "@/redux/slices/appConfig";

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
  const totalSteps = useSelector(preTestTotalSteps_);

  const router = useRouter();
  const preTestScreens = useSelector(preTestScreensData) as PreTestScreen[];
  const isDesktop = useResponsive();
  const dispatch = useDispatch();
  const { participant_id } = useSelector(authToken);

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
      const sigCapture = `${participant_id}-SignatureCapture-${Date.now()}.png`;
      dispatch(setSig(sigCapture));
      // uploadFileToS3(sigData, sigCapture).catch((error) => {
      uploadImagesToS3(sigData, sigCapture).catch((error) => {
        console.error("Signature IMage Upload Error:", error);
      });
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
              <p className={isDesktop ? "bold-headigs" : ""}>Clear Signature</p>
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

      <AppContainer
        header={
          // <AgreementHeader title="Signature " hasMute={false} />
          <AppHeader title={"Signature"} hasMute={false} />
        }
        body={
          <div className="sign-items-wrap">
            <div className="signBg-with-img">
              <h3 className="sign-note">Note that:</h3>
              <br />
              <p className="sign-desc">
                Please Sign in the white box in acceptance of the Agreement and
                Consent and press Next to continue.
              </p>
            </div>
            <div className="wrap-signature">
              <div style={{ width: "100%", height: "100%" }}>
                <SignatureCanvas
                  ref={(data) => setSigCanvas(data)}
                  penColor="#24527B"
                  canvasProps={{
                    width: 1800,
                    height: 1800,
                  }}
                />
              </div>
            </div>
          </div>
        }
        footer={
          isDesktop ? (
            <DesktopFooter
              currentNumber={2}
              outOf={preTestScreens.length > 0 ? totalSteps : 5}
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
              outOf={preTestScreens.length > 0 ? totalSteps : 5}
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
          )
        }
      />
    </div>
  );
};

export default SignaturePage;
