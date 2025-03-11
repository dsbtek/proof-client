'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    AgreementFooter,
    RadioButton,
    DatePicker,
    Loader_,
    DesktopFooter,
    AppContainer,
    AppHeader,
    TextInput,
} from '@/components';
import { useSelector } from 'react-redux';
import { testingKit } from '@/redux/slices/drugTest';
import { useRouter } from 'next/navigation';
import useResponsive from '@/hooks/useResponsive';
import {
    extractMainQuestions,
    getPreviousQuestion,
    getNextQuestion,
} from '@/utils/utils';
import { authToken } from '@/redux/slices/auth';
import { extractQuestionsFromSections } from '@/utils/utils';
import { toast } from 'react-toastify';

interface Question {
    sectionName?: string;
    skip_logic: boolean;
    required: boolean;
    question_type: string;
    question_id: string;
    question: string;
    options: string[] | null;
    image_url: string | null;
    questionIndex?: number;
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
    selectedOptionText?: string;
    selectedDate?: string;
};

const PreTest = () => {
    const { kit_id } = useSelector(testingKit);
    const preTestQuestionnaire = useSelector(
        (state: { preTest: { preTestQuestionnaire: Section[] } }) =>
            state.preTest.preTestQuestionnaire,
    );
    const [selectedOptions, setSelectedOptions] = useState<
        SelectedOptionState[]
    >([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedDate_, setSelectedDate] = useState('');
    const [enableOtherOption, setEnableOtherOption] = useState<boolean>(false);
    const [otherValue, setOtherValue] = useState('');
    const router = useRouter();
    const isDesktop = useResponsive();
    const { participant_id, pin } = useSelector(authToken);
    const { Test_Questionnaire_Name } = useSelector(testingKit);
    const [responses, setResponses] = useState<any[]>([]);
    const extractedQuestions =
        extractQuestionsFromSections(preTestQuestionnaire);
    const mainQuestions = extractMainQuestions(extractedQuestions);
    const [question, setQuestion] = useState<Question>(
        mainQuestions[0]?.question || {},
    );

    useEffect(() => {
        const currentQuestion = question;
        const currentOption = selectedOptions.find(
            (opt) => opt.questionIndex === currentQuestionIndex,
        );

        if (currentOption && currentQuestion?.options) {
            const selectedAnswer =
                currentQuestion.options[currentOption.selectedOption ?? 0];

            if (
                selectedAnswer === 'Other' ||
                selectedAnswer === 'Or enter the number of months'
            ) {
                setEnableOtherOption(true);
            } else {
                setEnableOtherOption(false);
            }
        } else {
            setEnableOtherOption(false);
        }
    }, [currentQuestionIndex, question, selectedOptions]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedOptions((prev) => {
            const newOptions = prev.filter(
                (opt) =>
                    opt.sectionIndex !== currentSectionIndex ||
                    opt.questionIndex !== currentQuestionIndex,
            );
            return [
                ...newOptions,
                {
                    sectionIndex: currentSectionIndex,
                    questionIndex: currentQuestionIndex,
                    selectedOption: null,
                    selectedDate: date,
                },
            ];
        });
    };

    const handleDisableNextBtn = (): boolean => {
        const currentQuestion = extractedQuestions[currentQuestionIndex];
        const isAnswered = selectedOptions.some(
            (opt) => opt.questionIndex === currentQuestionIndex,
        );

        // For date type questions
        if (currentQuestion?.question_type?.includes('Date')) {
            return !selectedDate_;
        }

        // For questions with "Other" option selected
        if (enableOtherOption) {
            return !otherValue.trim();
        }

        // For other question types
        return currentQuestion?.required && !isAnswered;
    };

    const handleOptionChange = (
        sectionIndex: number,
        questionIndex: number,
        optionIndex: number,
    ) => {
        const selectedOptionText =
            extractedQuestions?.[questionIndex]?.options?.[optionIndex] || '';

        setSelectedOptions((prev) => {
            const newOptions = prev.filter(
                (opt) =>
                    opt.sectionIndex !== sectionIndex ||
                    opt.questionIndex !== questionIndex,
            );
            return [
                ...newOptions,
                {
                    sectionIndex,
                    questionIndex,
                    selectedOption: optionIndex,
                    selectedOptionText,
                },
            ];
        });

        // Enable or disable the "Other" input dynamically
        if (
            selectedOptionText === 'Other' ||
            selectedOptionText === 'Or enter the number of months'
        ) {
            setEnableOtherOption(true);
        } else {
            setEnableOtherOption(false);
            setOtherValue(''); // Reset other value when switching options
        }
    };

    // const currentSection = preTestQuestionnaire[currentSectionIndex];

    const selectedOption = selectedOptions.find(
        (opt) =>
            opt.sectionIndex === currentSectionIndex &&
            opt.questionIndex === currentQuestionIndex,
    )?.selectedOption;

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex === 0) return;

        let prevIndex = currentQuestionIndex - 1;

        // If the previous question was a follow-up, move back to the main question
        if (
            mainQuestions[prevIndex]?.Yes === question ||
            mainQuestions[prevIndex]?.No === question
        ) {
            prevIndex--; // Go back further to the main skip logic question
        }

        const prevQuestion = mainQuestions[prevIndex]?.question;
        if (prevQuestion) {
            setCurrentQuestionIndex(prevIndex);
            setQuestion(prevQuestion);
        }
    };

    const handleNextQuestion = async () => {
        if (!question) return;

        const selectedOption = selectedOptions.find(
            (opt) =>
                opt.sectionIndex === currentSectionIndex &&
                opt.questionIndex === currentQuestionIndex,
        );

        const selectedOptionText = selectedOption?.selectedOptionText || '';

        const currentSection = preTestQuestionnaire[currentSectionIndex];

        const responseObj = {
            question: question?.question,
            question_id: question?.question_id,
            question_type: question?.question_type,
            section_description:
                currentSection?.sectionDescription || 'Unknown Section',
            section_order: currentSection?.sectionOrder || -1,
            selected_option: question?.question_type?.includes('Date')
                ? selectedOption?.selectedDate || ''
                : enableOtherOption
                ? otherValue.trim() // Use inputted value if "Other" is enabled
                : selectedOptionText,
        };

        const updatedResponses = [...responses, responseObj];

        setResponses(updatedResponses);

        // Move to the next question
        const nextQuestion = getNextQuestion(
            mainQuestions,
            currentQuestionIndex,
            selectedOptionText as 'Yes' | 'No' | undefined,
        );

        if (nextQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setQuestion(nextQuestion);
        } else {
            console.log('Submitting Responses...', updatedResponses);
            try {
                const submitResponse = await fetch('/api/pre-test-response', {
                    method: 'POST',
                    headers: {
                        participant_id: participant_id as string,
                        pin: pin as string,
                        form_name: Test_Questionnaire_Name,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ questions: updatedResponses }),
                });

                const result = await submitResponse.json();
                console.log('Submit Response:', result);

                if (submitResponse.ok) {
                    toast.success('Responses submitted successfully!');
                    router.push('/test-collection/clear-view');
                } else {
                    toast.error('Failed to submit responses');
                }
            } catch (error) {
                console.error('Error submitting responses:', error);
                toast.error('An error occurred while submitting responses.');
            }
        }
    };

    if (!preTestQuestionnaire?.length) {
        return <Loader_ />;
    }

    return (
        <AppContainer
            header={
                <AppHeader
                    title={question?.sectionName || ''}
                    hasMute={false}
                />
            }
            body={
                !isDesktop ? (
                    <div className="agreement-items-wrap scroller">
                        {question?.image_url && (
                            <Image
                                className="get-started-img"
                                src={question?.image_url}
                                alt="image"
                                layout="fit"
                                objectFit="contain"
                            />
                        )}
                        <p className="get-started-title">
                            {question?.question}
                        </p>
                        <br />
                        {question?.options && (
                            <div className="radio-button-container">
                                {question?.options.map((opt, optIndex) => (
                                    <RadioButton
                                        key={`${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                                        onChange={() =>
                                            handleOptionChange(
                                                currentSectionIndex,
                                                currentQuestionIndex,
                                                optIndex,
                                            )
                                        }
                                        checked={selectedOption === optIndex}
                                        label={opt}
                                    />
                                ))}
                            </div>
                        )}

                        {question?.question_type?.includes('Date') && (
                            <div className="radio-button-container">
                                <DatePicker
                                    title={'Select a date'}
                                    onDateSelect={handleDateSelect}
                                />
                            </div>
                        )}
                        {enableOtherOption && (
                            <div className="radio-button-container">
                                <TextInput
                                    type="text"
                                    placeholder="Enter your answer here"
                                    name="other_input"
                                    value={otherValue}
                                    onChange={(e) =>
                                        setOtherValue(e.target.value)
                                    }
                                    errors={''}
                                    touched={false}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="test-items-wrap-desktop_ ">
                        <div
                            className={
                                question?.image_url
                                    ? 'sub-item'
                                    : 'pre-test-questions-holder'
                            }
                        >
                            <p className="get-started-title">
                                {question?.question}
                            </p>
                            <br />

                            {question?.options && (
                                <div className="radio-button-container">
                                    {question?.options.map((opt, optIndex) => (
                                        <RadioButton
                                            key={`${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                                            onChange={() =>
                                                handleOptionChange(
                                                    currentSectionIndex,
                                                    currentQuestionIndex,
                                                    optIndex,
                                                )
                                            }
                                            checked={
                                                selectedOption === optIndex
                                            }
                                            label={opt}
                                        />
                                    ))}
                                </div>
                            )}

                            {question?.question_type?.includes('Date') && (
                                <div className="radio-button-container">
                                    <p
                                        style={{
                                            textAlign: 'left',
                                            color: '#4E555D',
                                        }}
                                    >
                                        Please provide us your date of birth to
                                        be continue. This information helps us
                                        verify your identity and ensure a
                                        personalized experience.
                                    </p>
                                    <br />
                                    <DatePicker
                                        title={'Select a date'}
                                        onDateSelect={handleDateSelect}
                                        date={selectedDate_}
                                    />
                                    <br />
                                    <p
                                        style={{
                                            textAlign: 'left',
                                            color: '#EF4444',
                                        }}
                                    >
                                        Your date of birth will be used solely
                                        for verification purposes and will not
                                        be shared with third parties.
                                    </p>
                                </div>
                            )}
                            {enableOtherOption && (
                                <div className="radio-button-container">
                                    <TextInput
                                        type="text"
                                        placeholder="Enter your answer here"
                                        name="other_input"
                                        value={otherValue}
                                        onChange={(e) =>
                                            setOtherValue(e.target.value)
                                        }
                                        errors={''}
                                        touched={false}
                                    />
                                </div>
                            )}
                        </div>

                        {question?.image_url && (
                            <Image
                                className="get-started-img"
                                src={question?.image_url}
                                alt="image"
                                layout="fit"
                                objectFit="contain"
                            />
                        )}
                    </div>
                )
            }
            footer={
                isDesktop ? (
                    <DesktopFooter
                        currentNumber={currentQuestionIndex + 1}
                        outOf={extractedQuestions?.length}
                        onPagination={true}
                        onLeftButton={currentQuestionIndex > 0}
                        onRightButton={true}
                        btnLeftText="Previous"
                        btnRightText="Next"
                        btnRightLink={
                            currentQuestionIndex <
                                (extractedQuestions[currentQuestionIndex]
                                    ?.options?.length || 0) -
                                    1 ||
                            currentSectionIndex <
                                preTestQuestionnaire.length - 1
                                ? ''
                                : `/test-collection/clear-view`
                        }
                        onClickBtnLeftAction={handlePreviousQuestion}
                        onClickBtnRightAction={handleNextQuestion}
                        rightdisabled={handleDisableNextBtn()}
                        onProgressBar={true}
                    />
                ) : (
                    <AgreementFooter
                        currentNumber={currentQuestionIndex + 1}
                        outOf={extractedQuestions?.length}
                        onPagination={true}
                        onLeftButton={currentQuestionIndex > 0}
                        onRightButton={true}
                        btnLeftText="Previous"
                        btnRightText="Next"
                        btnRightLink={
                            currentQuestionIndex <
                                (extractedQuestions[currentQuestionIndex]
                                    ?.options?.length || 0) -
                                    1 ||
                            currentSectionIndex <
                                preTestQuestionnaire.length - 1
                                ? ''
                                : `/test-collection/clear-view`
                        }
                        onClickBtnLeftAction={handlePreviousQuestion}
                        onClickBtnRightAction={handleNextQuestion}
                        rightdisabled={handleDisableNextBtn()}
                    />
                )
            }
        />
    );
};

export default PreTest;
