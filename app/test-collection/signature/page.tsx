"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactSignatureCanvas from 'react-signature-canvas';
import SignatureCanvas from 'react-signature-canvas';
import { useDispatch } from "react-redux";

import { AgreementHeader, AgreementFooter, Button } from "@/components";
import { setSig } from "@/redux/slices/drugTest";
import { toast } from "react-toastify";

const SignaturePage = () => {
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [clearSignatureConfirmed, setClearSignatureConfirmed] = useState(false);
  const [sigCanvas, setSigCanvas] = useState<ReactSignatureCanvas | null>();
  const [sigCheck, setSigCheck] = useState(false);

  const dispatch = useDispatch();

  const handleClearSignature = () => {
    setShowClearPrompt(true);
    setClearSignatureConfirmed(false);
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
      toast.success("Signature Signed Successfully. Click next to continue");
    } else {
      console.error("Signature Canvas is not available");
    }
  }

  useEffect(() => {
    if (clearSignatureConfirmed) {
      clearSignature();
    }
  }, [clearSignature, clearSignatureConfirmed, sigCanvas]);

  return (
    <div className="container-test-collection">
      {showClearPrompt && (
        <div className="overLay">
          <div className="prompt">
            <div className="prompt-item">
              <p>Clear Signature</p>
              <p>Are you sure you want to clear the signature?</p>
            </div>
            <div className="prompt-btn">
              <Button classname="prompt-cancel-btn" onClick={() => setShowClearPrompt(false)}>
                Cancel
              </Button>
              <Button classname="prompt-yes-btn" onClick={confirmClearSignature}>
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      <AgreementHeader title=" " />
      <div className="sign-items-wrap">
        <div className="signBg-with-img" style={{ backgroundImage: 'url("../images/signBg.png")', backgroundSize: "cover", backgroundRepeat: "no-repeat", }}>
          <p className="sign-text">
            Please Sign in the white box in acceptance of the Agreement and Consent and press Next to continue.
          </p>
        </div>
        <div className="wrap-signature">
          <div style={{ width: '100%', height: '100%' }}>
            <SignatureCanvas
              ref={data => setSigCanvas(data)}
              penColor='#24527B'
              canvasProps={{ width: 600, height: 250, className: 'sigCanvas' }}
            />
          </div>
        </div>
        <div className="signBg-with"></div>
      </div>

      <AgreementFooter
        currentNumber={2}
        outOf={4}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink={""}
        btnRightLink={!sigCheck ? '' : '/test-collection/get-started'}
        btnLeftText={"Clear"}
        btnRightText={!sigCheck ? "Sign" : "Next"}
        onClickBtnLeftAction={handleClearSignature}
        onClickBtnRightAction={!sigCheck ? saveSignature : () => { }}
      />
    </div>
  );
};

export default SignaturePage;
