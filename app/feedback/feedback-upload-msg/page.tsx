"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, RadioButton } from "@/components";

const FeedbackRating = () => {

  return (
    <>
      <div className="container-test-collection">
        <AgreementHeader title="Feedback" />
        <div className="agreement-items-wrap">

          <p className="feedback-text">
            Your sample collection is now complete. Please be patient while we upload your video. <b>DO NOt</b>, again DO NOT minimize or close the <b>PROOF App</b>  until the upload is complete.
          </p>

        </div>
      </div>
      <AgreementFooter currentNumber={3} outOf={3} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/home"} btnLeftText={""} btnRightText={"Start"} />
    </>

  );
};

export default FeedbackRating;


