'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBattery } from 'react-use';
import Image from 'next/image';

import {
    AgreementHeader,
    AppContainer,
    AppHeader,
    Button,
    DesktopFooter,
    Menu,
    MiniLoader,
} from '@/components';
import {
    checkAvailableStorage,
    decryptIdAndCredentials,
    checkSignalStrength,
    /*FastTest,*/ generateSystemChecks,
} from '@/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { testingKit } from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';
import { setPreTestQuestionnaire } from '@/redux/slices/pre-test';
import useResponsive from '@/hooks/useResponsive';
import { authToken } from '@/redux/slices/auth';

const SystemCheckMobile = () => {
    const battery = useBattery();
    const dispatch = useDispatch();
    const isDesktop = useResponsive();

    const deviceBatteryLevel =
        battery.isSupported && battery.fetched
            ? parseFloat((battery.level * 100).toFixed(0))
            : 0;
    const [storageLevel, setStorageLevel] = useState<number>(0);
    const [internetSpeed, setInternetSpeed] = useState('0kb/0kb');
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [checkIfCalled, setCheckedIfCalled] = useState(false);
    const { Pre_Test_Questionnaire_Name } = useSelector(testingKit);
    const [effectiveBandwidth, setEffectiveBandwidth] = useState(0);
    const { participant_id, pin } = useSelector(authToken);

    const [systemChecks, setSystemChecks] = useState([
        {
            imgUrl: '',
            title: 'Battery Life is at least 50%',
            subTitle: 'pending...',
            status: 'fail',
        },
        {
            imgUrl: '',
            title: 'At least 1GB of storage available',
            subTitle: 'pending...',
            status: 'fail',
        },
        {
            imgUrl: '',
            title: 'Strong network signal',
            subTitle: 'pending...',
            status: 'fail',
        },
    ]);
    const fetchPreTestQuestionnaire = useCallback(async () => {
        setCheckedIfCalled(true);
        try {
            const response = await fetch('/api/pre-test-questionnaire', {
                method: 'POST',
                headers: {
                    participant_id: participant_id as string,
                    pin: pin as string,
                    form_name: Pre_Test_Questionnaire_Name,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // toast.success(data?.data?.message || 'An error occured')
                dispatch(setPreTestQuestionnaire(data?.data?.sections));
            } else {
                console.log('Error submitting data');
                // toast.error("Error submitting data");
            }
        } catch (error) {
            // toast.warning(`Error: ${error}`);
        }
    }, [Pre_Test_Questionnaire_Name, dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            const storage =
                (await checkAvailableStorage()) as unknown as number;
            setStorageLevel(storage!);

            const bandwith = (await checkSignalStrength()) as number;
            setEffectiveBandwidth(bandwith);

            setSystemChecks(
                await generateSystemChecks(
                    deviceBatteryLevel,
                    storageLevel,
                    effectiveBandwidth,
                ),
            );
        };
        fetchData();
        if (!checkIfCalled) {
            fetchPreTestQuestionnaire();
        }
    }, [
        deviceBatteryLevel,
        downloadSpeed,
        effectiveBandwidth,
        internetSpeed,
        storageLevel,
        fetchPreTestQuestionnaire,
        checkIfCalled,
    ]);

    return (
        <AppContainer
            header={<AppHeader title="System Check " hasMute={false} />}
            body={
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    {systemChecks.map((check, index) => (
                        <div className="system-check-list" key={index}>
                            {check.imgUrl === '' ? (
                                <MiniLoader size="40px" />
                            ) : (
                                <Image
                                    src={check.imgUrl}
                                    alt="image"
                                    width={5000}
                                    height={5000}
                                    loading="lazy"
                                    className="sys-chk-icon"
                                />
                            )}
                            <div className="wrap-title">
                                <p className="system-check-title">
                                    {check.title}
                                </p>
                                {check.status === 'pass' ? (
                                    <p className="system-check-sub-title">
                                        {check.subTitle}
                                    </p>
                                ) : (
                                    <p className="system-check-sub-title-check-bad">
                                        {check.subTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            }
            footer={
                <div
                    className="btn-system-chk"
                    style={{
                        width: '100%',
                        margin: '10px auto',
                        height: '100%',
                    }}
                >
                    <Button
                        blue
                        type="submit"
                        link={'/test-collection/agreement'}
                    >
                        Next
                    </Button>
                </div>
            }
        />
    );
};

export default SystemCheckMobile;
