'use client'
import { useState } from 'react';
import { Menu, AppHeader } from '@/components';
import { historyData } from "@/redux/slices/appConfig";
import { useSelector } from "react-redux";


const BacTestHistory = () => {
    const loginData = useSelector(historyData);
    const [loginDataLog] = useState(loginData?.bactests);


    return (
        <div className="container">
            <AppHeader title="History" />
            <br />
            <p className="login-history-title">Test Date</p>
            <div className="login-history-container">
                {loginDataLog?.map((data: any, index: number) => (
                    < div key={index} className='bac-test-items'>
                        <p>Submitted Date {data?.submitteddate}</p>
                        <p>Imported Date {data.importeddate}</p>
                    </div>
                ))}
            </div>
            <div className='menu-wrapper-style'>
                <Menu />
            </div>

        </div>
    );
};

export default BacTestHistory;
