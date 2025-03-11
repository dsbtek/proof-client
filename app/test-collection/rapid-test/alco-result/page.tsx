'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlcoOraltoxResultTypeModal,
    AppContainer,
    AppHeader,
    DesktopFooter,
} from '@/components';
import {
    alcoholImgStr,
    alcoAIRes_,
    appData,
    setAlcoStripHistory,
    setAlocholResult,
} from '@/redux/slices/appConfig';
import { useRouter } from 'next/navigation';
import { testingKit } from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';

interface AlcoResponse {
    data?: string;
}

const Desktop = () => {
    const { kit_name } = useSelector(testingKit);
    const { permissions } = useSelector(appData);
    const resultAlco = useSelector(alcoAIRes_);
    const appPermissions = permissions ? permissions.split(';') : undefined;
    const [result, setResult] = useState<string>(
        'Not detected by AI tap to edit',
    );
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const alcoholImg = useSelector(alcoholImgStr);
    const dispatch = useDispatch();
    const handleResultModalClose = () => {
        setIsVisible(false);
    };

    const switchBtnBg = () => {
        if (result === 'Positive') return '#FEE2E2';
        else if (result === 'Negative') return '#10B98133';
        else return '#EAEAEA';
    };

    const handleSetResult = (name: string) => {
        dispatch(setAlocholResult(name));
        dispatch(
            setAlcoStripHistory(
                `Alco;Old Result: ${result}, New Result: ${name};`,
            ),
        );
        setResult(name);
        setIsVisible(false);
    };

    const parseAlcoResponse = (response: AlcoResponse) => {
        // Check if data exists and is not empty
        console.log(response);
        if (!response) {
            console.error('No strip data available in the response');
            return [];
        }
        setResult(response as any);
    };

    useEffect(() => {
        parseAlcoResponse(resultAlco as any);
    }, []);

    return (
        <>
            {isVisible && (
                <AlcoOraltoxResultTypeModal
                    onClose={handleResultModalClose}
                    setResult={handleSetResult}
                />
            )}
            <AppContainer
                header={<AppHeader title={kit_name} hasMute={false} />}
                body={
                    <div className="test-items-wrap-desktop_">
                        <div className="sub-item">
                            <div className="alco-result-wrap">
                                <p className="get-started-title bold-headigs">
                                    Match Test Results Using Color Chart
                                </p>
                                <p className="with-bullet">
                                    {' '}
                                    Using the color chart below, populated with
                                    the results.
                                </p>
                                <br />
                                <p className="with-bullet">
                                    You may click “Next” to each option and
                                    enter the test result that best matches your
                                    device result (Negative, Positive, or
                                    Invalid).
                                </p>
                                <h3>Postive</h3>

                                <div
                                    style={{
                                        display: 'flex',
                                        height: '40px',
                                        width: '100%',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid  #E3E6EB',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: '90%',
                                            borderRight: '1px solid  #E3E6EB',
                                        }}
                                    ></div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            width: '10%',
                                        }}
                                    >
                                        {' '}
                                        <div
                                            className="indicate-alco-level"
                                            style={{
                                                height: '100%',
                                                width: '6px',
                                                background: '#3B8085',
                                            }}
                                        ></div>{' '}
                                    </div>
                                </div>
                                <h3>Negative</h3>
                                <div
                                    style={{
                                        display: 'flex',
                                        height: '40px',
                                        width: '100%',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid  #E3E6EB',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: '90%',
                                            borderRight: '1px solid  #E3E6EB',
                                        }}
                                    ></div>
                                    <div
                                        style={{ height: '100%', width: '10%' }}
                                    ></div>
                                </div>
                                <div
                                    className="reult-status-indicator"
                                    style={{ background: `${switchBtnBg()}` }}
                                >
                                    <p>Result</p>
                                    <p>{result}</p>
                                    <Image
                                        className="alco-result-edit"
                                        src={'/icons/edit-icon.svg'}
                                        alt="edit icon"
                                        width={3000}
                                        height={3000}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setIsVisible(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="wrap-img"
                            style={{
                                backgroundImage: `url(${
                                    alcoholImg || '/images/alco-result.svg'
                                })`,
                            }}
                        />
                    </div>
                }
                footer={
                    <DesktopFooter
                        currentNumber={5}
                        outOf={5}
                        onPagination={false}
                        onLeftButton={false}
                        onRightButton={true}
                        btnLeftLink={''}
                        btnRightLink={'/test-collection/rapid-test/oraltox'}
                        btnLeftText={'Decline'}
                        btnRightText={'Next'}
                    />
                }
            />
        </>
    );
};

export default Desktop;
