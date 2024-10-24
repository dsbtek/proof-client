"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, RadioButton, DateSelector, Loader_, DatePicker, DesktopFooter } from "@/components";
import { useSelector } from "react-redux";
import { testingKit } from '@/redux/slices/drugTest';
import { useRouter } from 'next/navigation';
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

type SelectedOptionState = {
  sectionIndex: number;
  questionIndex: number;
  selectedOption: number | null;
  selectedDate?: string;
};

const PreTest = () => {
  const { kit_id } = useSelector(testingKit);
  const preTestQuestionnaire = useSelector((state: { preTest: { preTestQuestionnaire: Section[] } }) => state.preTest.preTestQuestionnaire);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionState[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedDate_, setSelectedDate] = useState('');
  const router = useRouter();
  const isDesktop = useResponsive();

  useEffect(() => {
    if (preTestQuestionnaire.length) {
      const initialSelectedOptions = preTestQuestionnaire.map((section, sectionIndex) =>
        section.questions.map((question, questionIndex) => ({
          sectionIndex,
          questionIndex,
          selectedOption: null,
          selectedDate: "",
        }))
      ).flat();
      setSelectedOptions(initialSelectedOptions);
    }
  }, [preTestQuestionnaire]);

  const handleOptionChange = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.map((selectedOption) =>
        selectedOption.sectionIndex === sectionIndex && selectedOption.questionIndex === questionIndex
          ? { ...selectedOption, selectedOption: optionIndex }
          : selectedOption
      )
    );
  };

  const handleDateChange = (sectionIndex: number, questionIndex: number, date: string) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.map((selectedOption) =>
        selectedOption.sectionIndex === sectionIndex && selectedOption.questionIndex === questionIndex
          ? { ...selectedOption, selectedDate: date }
          : selectedOption
      )
    );
  };

  const handleNext = () => {
    let nextSectionIndex = currentSectionIndex;
    let nextQuestionIndex = currentQuestionIndex;
    const currentSection = preTestQuestionnaire[currentSectionIndex];
    const totalQuestionsInSection = currentSection.questions.length;

    console.log("Current Section Index:", nextSectionIndex);
    console.log("Current Question Index:", nextQuestionIndex);

    // Move to the next question
    nextQuestionIndex++;

    // Check for skip logic and move accordingly
    while (nextQuestionIndex < totalQuestionsInSection && currentSection.questions[nextQuestionIndex].skip_logic) {
      nextQuestionIndex++;
    }

    console.log("After Skip Logic - Next Section Index:", nextSectionIndex);
    console.log("After Skip Logic - Next Question Index:", nextQuestionIndex);

    // If we have reached the end of the current section's questions, move to the next section
    if (nextQuestionIndex >= totalQuestionsInSection) {
      nextSectionIndex++;
      nextQuestionIndex = 0;

      // Check for skip logic in the new section
      if (nextSectionIndex < preTestQuestionnaire.length) {
        const nextSection = preTestQuestionnaire[nextSectionIndex];
        while (nextQuestionIndex < nextSection.questions.length && nextSection.questions[nextQuestionIndex].skip_logic) {
          nextQuestionIndex++;
        }
      }
    }

    console.log("Final Section Index:", nextSectionIndex);
    console.log("Final Question Index:", nextQuestionIndex);

    // Check if we have reached the end of the questionnaire
    if (nextSectionIndex >= preTestQuestionnaire.length) {
      router.push(`/test-collection/${kit_id}`);
    } else {
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(nextQuestionIndex);
    }
  };


  const handlePrev = () => {
    let prevSectionIndex = currentSectionIndex;
    let prevQuestionIndex = currentQuestionIndex;

    // Move to the previous question
    prevQuestionIndex--;

    // If we have reached the beginning of the current section's questions, move to the previous section
    if (prevQuestionIndex < 0) {
      prevSectionIndex--;
      if (prevSectionIndex >= 0) {
        const prevSection = preTestQuestionnaire[prevSectionIndex];
        prevQuestionIndex = prevSection.questions.length - 1;
      }
    }

    // Check if we are at the beginning of the questionnaire
    if (prevSectionIndex < 0) {
      // Handle the case where there is no previous question (disable the Previous button in this case)
      return;
    }

    setCurrentSectionIndex(prevSectionIndex);
    setCurrentQuestionIndex(prevQuestionIndex);
  };
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  const handleDisableNextBtn = (): boolean => {
    const currentSelection = selectedOptions.find(
      (option) => option.sectionIndex === currentSectionIndex && option.questionIndex === currentQuestionIndex
    );

    const selectedOption = currentSelection?.selectedOption;
    const selectedDate = currentSelection?.selectedDate;

    if (currentQuestion?.question_type?.includes('Date')) {
      // If the question requires a date and the date is not selected
      return !selectedDate_;
    }

    // If it's not a date question, check for selected option
    return selectedOption === null;
  };


  if (!preTestQuestionnaire?.length) {
    return <Loader_ />;
  }

  const currentSection = preTestQuestionnaire[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const selectedOption = selectedOptions.find(
    (option) => option.sectionIndex === currentSectionIndex && option.questionIndex === currentQuestionIndex
  )?.selectedOption;
  const selectedDate = selectedOptions.find(
    (option) => option.sectionIndex === currentSectionIndex && option.questionIndex === currentQuestionIndex
  )?.selectedDate;

  return (
    <div className="container-test-collection">
      <AgreementHeader title={currentSection?.sectionName} />
      {!isDesktop ?
        <div className="agreement-items-wrap">
          {currentQuestion.image_url && (
            <Image
              className="get-started-img"
              src={currentQuestion.image_url}
              alt="image"
              width={3000}
              height={3000}
            />
          )}
          <p className="get-started-title">{currentQuestion?.question}</p>
          <br />
          {currentQuestion?.options && (
            <div className="radio-button-container">
              {currentQuestion.options.map((opt, optIndex) => (
                <RadioButton
                  key={`${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                  onChange={() => handleOptionChange(currentSectionIndex, currentQuestionIndex, optIndex)}
                  checked={selectedOption === optIndex}
                  label={opt}
                />
              ))}
            </div>
          )}

          {currentQuestion?.question_type?.includes('Date') && (
            <div className="radio-button-container">
              <DatePicker title={"Select a date"} onDateSelect={handleDateSelect} />
            </div>
          )}
        </div>
        :
        <div className="test-items-wrap-desktop_ ">

          <div className={currentQuestion.image_url ? "sub-item" : "pre-test-questions-holder"}>
            <p className="get-started-title">{currentQuestion?.question}</p>
            <br />

            {currentQuestion?.options && (
              <div className="radio-button-container">
                {currentQuestion.options.map((opt, optIndex) => (
                  <RadioButton
                    key={`${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                    onChange={() => handleOptionChange(currentSectionIndex, currentQuestionIndex, optIndex)}
                    checked={selectedOption === optIndex}
                    label={opt}
                  />
                ))}
              </div>
            )}

            {currentQuestion?.question_type?.includes('Date') && (
              <div className="radio-button-container">
                <p style={{ textAlign: "left", color: "#4E555D" }}>
                  Please provide us your date of birth to be continue. This information helps us verify your identity and ensure a personalized experience.
                </p>
                <br />
                <DatePicker title={"Select a date"} onDateSelect={handleDateSelect} date={selectedDate_} />
                <br />
                <p style={{ textAlign: "left", color: "#EF4444" }}>
                  Your date of birth will be used solely for verification purposes and will not be shared with third parties.
                </p>
              </div>
            )}

          </div>

          {currentQuestion.image_url && (
            <Image
              className="get-started-img"
              src={currentQuestion.image_url}
              alt="image"
              width={3000}
              height={3000}
            />
          )}
        </div>
      }


      {isDesktop?
        <DesktopFooter
          currentNumber={currentQuestionIndex + 1}
          outOf={currentSection.questions.length}
          onPagination={true}
          onLeftButton={currentQuestionIndex > 0}
          onRightButton={true}
          btnLeftText="Previous"
          btnRightText="Next"
          btnRightLink={currentQuestionIndex < currentSection.questions.length - 1 || currentSectionIndex < preTestQuestionnaire.length - 1 ? '' : `/test-collection/${kit_id}`}
          onClickBtnLeftAction={handlePrev}
          onClickBtnRightAction={handleNext}
          rightdisabled={handleDisableNextBtn()}
          onProgressBar={true}
        /> :
      <AgreementFooter
          currentNumber={currentQuestionIndex + 1}
          outOf={currentSection.questions.length}
          onPagination={true}
          onLeftButton={currentQuestionIndex > 0}
          onRightButton={true}
          btnLeftText="Previous"
          btnRightText="Next"
          btnRightLink={currentQuestionIndex < currentSection.questions.length - 1 || currentSectionIndex < preTestQuestionnaire.length - 1 ? '' : `/test-collection/${kit_id}`}
          onClickBtnLeftAction={handlePrev}
          onClickBtnRightAction={handleNext}
          rightdisabled={handleDisableNextBtn()}
        />
    }
    </div>
  );
};

export default PreTest;
