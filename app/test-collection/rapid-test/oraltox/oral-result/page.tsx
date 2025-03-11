'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlcoOraltoxResultTypeModal,
    AppContainer,
    AppHeader,
    DesktopFooter,
    OraltoxResultAgreementDisagree,
    OraltoxResultStatusIndicator,
} from '@/components';
import {
    appData,
    setAgreeDisagree,
    addToOraltoxStripHistory,
    userIdString,
    setOraltoxResult,
    alcoOraltoxAIRes_,
    oraltoxImgStr,
} from '@/redux/slices/appConfig';
import { useRouter } from 'next/navigation';
import { testingKit } from '@/redux/slices/drugTest';

type StripData = {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
    label: 'Positive' | 'Negative' | 'Inconclusive';
    score: number;
};

type MappedStrip = {
    position: number;
    label: 'Positive' | 'Negative' | 'Inconclusive';
    boundingBox: {
        x_min: number;
        y_min: number;
        x_max: number;
        y_max: number;
    };
};

const Desktop = () => {
    const { permissions } = useSelector(appData);
    const oraltoxRes = useSelector(alcoOraltoxAIRes_);
    const oraltoxResImg = useSelector(oraltoxImgStr);
    const [id, setId] = useState<number>();
    const { kit_name } = useSelector(testingKit);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleAgreeDisAgree, setIsVisibleAgreeDisAgree] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [oraltoxResult_, setOraltoxResults] = useState([
        { id: 1, statusText: 'Positive', color: '#BC4637' },
        { id: 2, statusText: 'Positive', color: '#753536' },
        { id: 3, statusText: 'Positive', color: '#B78D2E' },
        { id: 4, statusText: 'Negative', color: '#48405E' },
        { id: 5, statusText: 'Positive', color: '#E38F46' },
        { id: 6, statusText: 'Negative', color: '#928254' },
        { id: 7, statusText: 'Positive', color: '#63616D' },
        { id: 8, statusText: 'Positive', color: '#6BAB58' },
        { id: 9, statusText: 'Negative', color: '#5190C4' },
        { id: 10, statusText: 'Positive', color: '#ECB365' },
    ]);

    const mapOraltoxStrips = (
        base64: string,
        response: { [key: string]: StripData },
    ): MappedStrip[] => {
        // Check if the response exists and is not empty
        if (!response || Object.keys(response).length === 0) {
            console.error('No strip data available in the response');
            return [];
        }

        // Extract and sort strips by their x_max values (right to left)
        const sortedStrips = Object.entries(response)
            .map(([key, strip]) => ({ id: key, ...strip }))
            .sort((a, b) => b.x_max - a.x_max);

        // Map sorted strips to their positions
        const mappedStrips = sortedStrips.map((strip, index) => ({
            position: index + 1,
            label: strip.label,
            boundingBox: {
                x_min: strip.x_min,
                y_min: strip.y_min,
                x_max: strip.x_max,
                y_max: strip.y_max,
            },
        }));
        return mappedStrips;
    };

    useEffect(() => {
        const result = mapOraltoxStrips(oraltoxResImg, oraltoxRes as any);

        // Create a lookup map from the API response
        const responseMap = new Map(
            result.map((item) => [item.position, item.label]),
        );

        // Update the state based on the response
        setOraltoxResults((prev) =>
            prev.map((item) => ({
                ...item,
                statusText:
                    responseMap.get(item.id) ||
                    'Not detected by AI tap to edit',
            })),
        );
    }, []);

    const handleResultModalClose = () => {
        setIsVisible(false);
    };

    const handleNext = () => {
        const extractResult = oraltoxResult_
            .map((item: { statusText: any }) => item.statusText)
            .join(',');
        setIsVisibleAgreeDisAgree(true);
        dispatch(setOraltoxResult(extractResult));
    };

    const handleSetResult = (name: string) => {
        if (id === undefined) {
            console.error('ID is undefined');
            return;
        }

        setOraltoxResults((prevResults: any[]) => {
            const currentResult = prevResults.find((res) => res.id === id);
            const oldResult = currentResult?.statusText || '';

            dispatch(
                addToOraltoxStripHistory({
                    id,
                    'Old Result': oldResult,
                    'New Result': name,
                }),
            );

            return prevResults.map((res) =>
                res.id === id ? { ...res, statusText: name } : res,
            );
        });

        setIsVisible(false);
    };

    const agree = () => {
        dispatch(setAgreeDisagree('I agree'));
        router.push('/test-collection/rapid-test/oraltox-alco-result');
    };

    const disAgree = () => {
        dispatch(setAgreeDisagree('I disagree'));
        router.push('/test-collection/rapid-test/oraltox-alco-result');
    };

    return (
        <>
            {isVisible && (
                <AlcoOraltoxResultTypeModal
                    onClose={handleResultModalClose}
                    setResult={handleSetResult}
                />
            )}
            {isVisibleAgreeDisAgree && (
                <OraltoxResultAgreementDisagree
                    onClose={() => setIsVisibleAgreeDisAgree(false)}
                    agree={agree}
                    disAgree={disAgree}
                />
            )}
            <AppContainer
                header={<AppHeader title={kit_name} hasMute={false} />}
                body={
                    <div className="test-items-wrap-desktop_">
                        <div className="sub-item">
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px',
                                    width: '95%',
                                }}
                            >
                                <p className="get-started-title bold-headigs">
                                    Results
                                </p>
                                <p className="with-bullet">
                                    Using the color chart below, populated with
                                    the results.
                                </p>
                                <p>
                                    You may click “Next” to each option and
                                    enter the test result that best matches your
                                    device result (Negative, Positive, or
                                    Invalid).
                                </p>
                                <Image
                                    className="oraltox-result-status-guide"
                                    src={'/images/oral.svg'}
                                    alt="Oraltox Result Guide"
                                    width={3000}
                                    height={3000}
                                />
                            </div>
                        </div>
                        <div className="wrap-img oraltox-result-wrap">
                            {oraltoxResult_?.map(
                                (result: {
                                    id: number;
                                    color: string;
                                    statusText: string | undefined;
                                }) => (
                                    <OraltoxResultStatusIndicator
                                        key={result.id}
                                        color={result.color}
                                        statusText={result.statusText}
                                        onClick={() => {
                                            setIsVisible(true);
                                            setId(result.id as number);
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                }
                footer={
                    <DesktopFooter
                        currentNumber={5}
                        outOf={5}
                        onPagination={false}
                        onLeftButton={false}
                        onRightButton={true}
                        onClickBtnRightAction={handleNext}
                        btnLeftText="Decline"
                        btnRightText="Next"
                    />
                }
            />
        </>
    );
};
export default Desktop;
