'use client';

import { useState } from 'react';
import { Menu, AppHeader } from '@/components';
import { historyData } from "@/redux/slices/appConfig";
import { useSelector } from "react-redux";

const LoginHistory = () => {
  const loginData = useSelector(historyData);
  const [loginDataLog] = useState(loginData?.checkinstatus);

  return (
    <div className="container">
      <AppHeader title="History" />
      <br /> <br />
      <p className="login-history-title">Dates you Logged In</p>
      <div className="login-history-container">

        {loginDataLog?.length > 0 ?
          loginDataLog?.map((data: any, index: number) => (
            <p key={index} className='bac-test-items'>{data?.checkindate}</p>
          ))
          :
          <p>No data available at the moment</p>
        }
      </div>
      <div className='menu-wrapper-style'>
        <Menu />
      </div>

    </div>
  );
};

export default LoginHistory;
