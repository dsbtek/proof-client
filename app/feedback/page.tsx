"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, RadioButton, TextAreaField, Loader_, DesktopFooter } from "@/components";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { decryptIdAndCredentials } from "@/utils/utils";
import { testingKit } from "@/redux/slices/drugTest";
import { useRouter } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";

interface Question {
  skip_logic: boolean;
  required: boolean;
  question_type: string;
  question_id: string;
  question: string;
  options: string[] | null;
  image_url: string | null;
}

interface Section {
  sectionOrder: string;
  sectionName: string;
  sectionID: string;
  sectionDescription: string;
  questions: Question[];
}

const FeedbackRating = () => {
  const data = useSelector((state: { preTest: { preTestFeedback: Section[] } }) => state.preTest.preTestFeedback);
  const { Feedback_Questionnaire_Name } = useSelector(testingKit);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState<string>("");
  const [responses, setResponses] = useState<any[]>([]);
  const router = useRouter();
  const isDesktop = useResponsive();

  if (!data || data.length === 0) {
    return <Loader_ />;
  }

  const questions = data[0]?.questions;
  const currentQuestion = questions ? questions[currentQuestionIndex] : null;
  const radioOptions = currentQuestion?.options?.map((option, index) => ({
    id: index + 1,
    label: option,
  })) || [];

  const handleRadioChange = (id: number) => {
    setSelectedRadio(id);
  };

  const handleTextChange = (value: string) => {
    setTextResponse(value);
  };

  const allChecked = selectedRadio !== null || textResponse !== "";

  const handleNextClick = async () => {
    const selectedOption =
      currentQuestion?.question_type === "Pick list"
        ? radioOptions.find((option) => option.id === selectedRadio)?.label
        : textResponse;

    const response = {
      question: currentQuestion?.question,
      question_id: currentQuestion?.question_id,
      question_type: currentQuestion?.question_type,
      section_description: data[0].sectionDescription,
      section_order: data[0].sectionOrder,
      selected_option: selectedOption,
    };

    setResponses([...responses, response]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedRadio(null);
      setTextResponse("");
    } else {
      // Post responses to the server
      try {
        const participant_id = localStorage.getItem("participant_id");
        const pin = localStorage.getItem("pin");
        const { strParticipantId, strPin } = decryptIdAndCredentials(participant_id, pin);
        const submitResponse = await fetch("/api/pre-test-response", {
          method: "POST",
          headers: {
            participant_id: strParticipantId,
            pin: strPin,
            form_name: Feedback_Questionnaire_Name,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions: [...responses, response] }),
        });

        if (submitResponse.ok) {
          toast.success("Responses submitted successfully!");
          router.push("/test-collection/collection-summary");
        } else {
          throw new Error("Failed to submit responses");
        }
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    }
  };

  const renderQuestionContentMobile = () => (

    <>
      <div className="feedback-gesture-wrap">
        {currentQuestion?.image_url && (
          <Image className="feedback-imoji" src={currentQuestion.image_url} alt="feedback image" width={3000} height={3000} />
        )}
      </div>
      <p className="feedback-text">{currentQuestion?.question}</p>
      {currentQuestion?.question_type === "Pick list" && (
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
      )}
      {currentQuestion?.question_type === "Text" && (
        <TextAreaField
          placeholder="Your feedback here..."
          value={textResponse}
          onChange={handleTextChange}
          style={{ width: "100%" }}
        />
      )}
    </>
  );

  const renderQuestionContentDesktop = () => (

    <div className="feed-back-destop-card">
      <p className="bold-headig">Give feedback</p>
      <div className="feedback-gesture-wrap">
        {currentQuestion?.image_url && (
          <Image className="feedback-imoji" src={currentQuestion.image_url} alt="feedback image" width={3000} height={3000} />
        )}
      </div>
      <p className="feedback-text">{currentQuestion?.question}</p>
      {currentQuestion?.question_type === "Pick list" && (
        <div className="radio-button-container">
          {radioOptions.map((option) => (
            <RadioButton
              key={option.id}
              onChange={() => handleRadioChange(option.id)}
              checked={selectedRadio === option.id}
              label={option.label}
            />
          ))}
        </div>
      )}
      {currentQuestion?.question_type === "Text" && (
        <TextAreaField
          placeholder="Your feedback here..."
          value={textResponse}
          onChange={handleTextChange}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );

  return (
    <div className="container-test-collection">
      <AgreementHeader title={data[0].sectionName} />

      {isDesktop ?
        <div className="feedback-items-wrap">
          {renderQuestionContentDesktop()}
      </div>
        :
        <div className="agreement-items-wrap">
          {renderQuestionContentMobile()}
        </div>

      }
      {!isDesktop ? (
        <AgreementFooter
          currentNumber={currentQuestionIndex + 1}
          outOf={questions.length}
          onPagination={true}
          onLeftButton={false}
          onRightButton={allChecked || currentQuestion?.question_type === "Text"}
          btnLeftLink=""
          btnRightLink=""
          btnLeftText="Decline"
          btnRightText={currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          onClickBtnRightAction={handleNextClick}
        />
      ) : (
        <DesktopFooter
          currentNumber={currentQuestionIndex + 1}
          outOf={questions.length}
          onPagination={true}
          onLeftButton={false}
          onRightButton={allChecked || currentQuestion?.question_type === "Text"}
          btnLeftLink=""
          btnRightLink=""
          btnLeftText="Decline"
          btnRightText={currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          onClickBtnRightAction={handleNextClick}
        />
      )}
    </div>
  );
};

export default FeedbackRating;
