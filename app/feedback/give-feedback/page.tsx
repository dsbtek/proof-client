"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, TextAreaField } from "@/components";

const GiveFeedback = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");


  return (
    <>
      <div className="container-test-collection">
        <AgreementHeader title="Feedback" />
        <div className="agreement-items-wrap">

          <p className="feedback-text">Please provide any feedback you may have</p>
          <TextAreaField placeholder={"Your feedback here..."} value={feedbackText} onChange={setFeedbackText} />
        </div>
      </div>
      <AgreementFooter
        currentNumber={2}
        outOf={3}
        onPagination={true}
        onLeftButton={false}
        onRightButton={true}
        btnLeftLink={""}
        btnRightLink={"/feedback/feedback-upload-msg"}
        btnLeftText={""}
        btnRightText={"Next"}
      />
    </>
  );
};

export default GiveFeedback;
