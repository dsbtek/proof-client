"use client";

import React, { useState } from "react";
import "./alcoResultModal.css";

interface IAlcoOraltoxResult {
  isVisible: boolean;
  isTimeOut?: boolean;
  success?: boolean;
  onClose?: () => void;
  reCapture?: () => void;
  testType: "Alco" | "Oraltox";
  result?: string;
}

const AlcoResult = ({
  isVisible,
  isTimeOut = false,
  success = false,
  onClose = () => {},
  reCapture = () => {},
  testType,
  result = "",
}: IAlcoOraltoxResult) => {
  const [progress, setProgress] = useState(0);

  // Exit early if modal is not visible
  if (!isVisible) return null;

  // Define variables for conditional rendering
  const title = isTimeOut
    ? "Timeout"
    : `Result ${success ? "Ready" : "Fail"}`;
  const message = !success
    ? "We are experiencing an issue and the result is not detected. Please click `Try Again` or `Continue` and enter your result."
    : `The test result ${success ? "has been" : "could not be"} read successfully. ${
        testType === "Alco" ? `<span class='result-span'>${result}</span>` :  `<span class='result-span'>${result}</span>`
      }`;

  const primaryButtonText = "Recapture";

  return (
    <div className="alco-bg" role="dialog" aria-labelledby="modal-title">
      <div className="alco-result-modal">
        <p id="modal-title" className="alco-text-title">
          {title}
        </p>
        <p
          className="alco-text-message"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <div className="wrap-alco-oraltox-btn" style={{display:"flex", width:"100%", gap:"12px"}}>
          <button
            className="alco-continue-btn"
            onClick={reCapture}
            aria-label={primaryButtonText}
          >
            {primaryButtonText}
          </button>
          <button
            className="alco-continue-btn"
            onClick={onClose}
            aria-label="Continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlcoResult;
