import { AppContainer, AppHeader, Menu } from '@/components';
import { historyData } from '@/redux/slices/appConfig';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const BacTestHistoryMobile = () => {
    const loginData = useSelector(historyData);
    const [loginDataLog] = useState(loginData?.bactests);

    return (
        <AppContainer
            header={<AppHeader title="History" hasMute={false} />}
            body={
                <div className="container">
                    <p className="login-history-title">Test Date</p>
                    <div className="login-history-container">
                        {loginDataLog?.map((data: any, index: number) => (
                            <div key={index} className="bac-test-items">
                                <p>Submitted Date {data?.submitteddate}</p>
                                <p>Imported Date {data.importeddate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
            footer={<Menu />}
        />
    );
};

export default BacTestHistoryMobile;
