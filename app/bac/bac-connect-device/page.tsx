"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, AppHeader } from "@/components";
import { useRouter } from 'next/navigation';
import { connectToBACDevice } from "@/utils/bluetooth";


const BacConnectDevice = () => {
  const [deviceStatus, setDeviceStatus] = useState(false)
  const router = useRouter();

  const handleDeviceConnection = async () => {
    setDeviceStatus(!deviceStatus)
    setTimeout(() => {
      router.push('/bac/bac-test');
    }, 5000);
  };


  return (
    <>
      <div className="container">
        <AppHeader title={"BAC TEST"} />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Image className="bac-img" src="/icons/bac.svg" alt="bac device image" width={3000} height={3000} />
        <br />
        <br />
        <br />
        {!deviceStatus &&
          <p className="" style={{ color: '#4E555D', textAlign: 'center' }}>Press the “Connect” button and turn on the BAC device.</p>
        }
        {deviceStatus &&
          <p className="" style={{ color: '#4E555D', textAlign: 'center' }}>Turn on the BAC device</p>
        }
        <br />
        <br />
        {!deviceStatus &&
          <Button blue style={{ width: '292px' }} onClick={handleDeviceConnection}>{"Connect"}</Button>
        }
      </div>
    </>

  );
};

export default BacConnectDevice;


