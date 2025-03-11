'use client';

import { AppContainer, AppHeader, Menu } from '@/components';
import { historyData } from '@/redux/slices/appConfig';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const LoginHistoryMobile = () => {
    const loginData = useSelector(historyData);
    const [loginDataLog] = useState(loginData?.checkinstatus);

    return (
        <AppContainer
            header={<AppHeader title="History" hasMute={false} />}
            body={
                <div className="container">
                    <p className="login-history-title">Dates you Logged In</p>
                    <div className="login-history-container">
                        {loginDataLog?.map((data: any, index: number) => (
                            <p key={index} className="bac-test-items">
                                {data?.checkindate}
                            </p>
                        ))}
                    </div>
                </div>
            }
            footer={<Menu />}
        />
    );
};

export default LoginHistoryMobile;
