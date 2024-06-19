"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, RadioButton } from "@/components";

const FeedbackRating = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);


  const radioOptions = [
    { id: 1, label: 'Happy' },
    { id: 2, label: 'Neutral' },
    { id: 3, label: 'Unhappy' },
    { id: 4, label: 'Other' }
  ];

  const handleRadioChange = (id: number) => {
    setSelectedRadio(id as any);
  };

  const allChecked = selectedRadio !== null;

  const rateSelected = (id: number) => {
    if (id === 4) return '/feedback/give-feedback'
    return '/feedback/feedback-upload-msg'
  }


  return (
    <>
      <div className="container-test-collection">
        <AgreementHeader title="Feedback" />
        <div className="agreement-items-wrap">
          <div className="feedback-gesture-wrap">
            <Image className="feedback-imoji" src="/images/happy.png" alt="image" width={3000} height={3000} />
            <Image className="feedback-imoji" src="/images/unhappy.png" alt="image" width={3000} height={3000} />
            <Image className="feedback-imoji" src="/images/angry.png" alt="image" width={3000} height={3000} />
          </div>
          <p className="feedback-text">Please rate your experience with the PROOF+ app</p>
          <div className="radio-container">
            {radioOptions.map((option) => (
              <RadioButton
                key={option.id}
                onChange={() => handleRadioChange(option.id)}
                checked={selectedRadio === option.id}
                label={option.label}
              />
            ))}
          </div>
        </div>
      </div>
      <AgreementFooter currentNumber={1} outOf={3} onPagination={true} onLeftButton={false} onRightButton={allChecked} btnLeftLink={""} btnRightLink={rateSelected(selectedRadio as any)} btnLeftText={"Decline"} btnRightText={"Next"} />
    </>

  );
};

export default FeedbackRating;


