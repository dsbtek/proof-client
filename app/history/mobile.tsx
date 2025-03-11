'use client';
import { useEffect } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import {
    AppHeader,
    Button,
    Loader_,
    DinamicMenuLayout,
    Header,
} from '@/components';
import { authToken } from '@/redux/slices/auth';
import { setHistoryData, historyData, appData } from '@/redux/slices/appConfig';
import { hasPermission } from '@/utils/utils';
import { GoArrowLeft } from 'react-icons/go';

const MobileHistory = () => {
    const dispatch = useDispatch();
    const { participant_id, pin } = useSelector(authToken);
    const history = useSelector(historyData);
    const userPermissions = useSelector(appData);
    const permissions = userPermissions?.permissions;
    const { data: histData, isLoading } = useQuery('history', {
        queryFn: async () => {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    participant_id: participant_id as string,
                    pin: pin as string,
                },
            });
            const data = await response.json();
            return data;
        },
        // enabled: false,
        onSuccess: ({ data }) => {
            console.log(data);
            if (data.status === 'Success') {
                dispatch(setHistoryData({ ...data }));
            } else {
                console.error(`Error ${data.statusCode}: ${data.message}`);
            }
        },
        onError: (error) => {
            toast.error('Sorry Cannot Fetch Data');
            console.error(error);
        },
    });

    return (
        <DinamicMenuLayout>
            <div className="tutorial-container" style={{ minHeight: '100%' }}>
                <Header
                    title="History"
                    icon1={<GoArrowLeft />}
                    hasMute={false}
                />
                <br />
                {isLoading ? (
                    <Loader_ />
                ) : (
                    <>
                        <Button
                            onClick={() => console.log('Login clicked')}
                            classname="history-button"
                            link="/history/login-history"
                        >
                            <span>Login</span>
                            <AiOutlineRight />
                        </Button>
                        {hasPermission('Test', permissions) && (
                            <Button
                                onClick={() => console.log('BAC Test clicked')}
                                classname="history-button"
                                link="/proof-pass"
                            >
                                <span> Test</span>
                                <AiOutlineRight />
                            </Button>
                        )}
                        {hasPermission('Test', permissions) && (
                            <Button
                                onClick={() => console.log('BAC Test clicked')}
                                classname="history-button"
                                link="/history/bac-test-history"
                            >
                                <span>BAC Test</span>
                                <AiOutlineRight />
                            </Button>
                        )}

                        {hasPermission('Priscription', permissions) && (
                            <Button
                                onClick={() => console.log('BAC Test clicked')}
                                classname="history-button"
                                link="/history"
                            >
                                <span>Prescriptions</span>
                                <AiOutlineRight />
                            </Button>
                        )}
                        {hasPermission('Calls', permissions) && (
                            <Button
                                onClick={() => console.log('BAC Test clicked')}
                                classname="history-button"
                                link="/history"
                            >
                                <span>Calls</span>
                                <AiOutlineRight />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </DinamicMenuLayout>
    );
};

export default MobileHistory;
