"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, AppHeader, Loader } from "@/components";
import { useRouter } from "next/navigation";
import { FiInfo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { bacTestData, connectToBreathalyzer, setIsConnecting } from "@/redux/slices/bac-test";
import { connectToBACDevice } from "@/utils/bluetooth";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";

const BacConnectDevice = () => {
  const [deviceStatus, setDeviceStatus] = useState(false);
  const router = useRouter();
  const appDispatch = useDispatch<AppDispatch>();

  const { connected, isConnecting, connectionError } = useSelector(bacTestData);

  const handleDeviceConnection = async () => {
    console.log('connecting...')
    setDeviceStatus(!deviceStatus);
    await appDispatch(connectToBreathalyzer());
  };

  useEffect(() => {
    connected && router.push("/bac/bac-test");

    if (connectionError !== "") {
      toast.error(`Error Connecting Device: ${connectionError}`)
      setDeviceStatus(false);
    }
  }, [connected, connectionError, router])

  return (
    <>
      {isConnecting && <Loader />}
      <div className="container-bac-screen">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: "16px",
          }}
        >
          <AppHeader title={"BAC TEST"} />
          <FiInfo color="#777777" size={24} />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Image
          className="bac-img"
          src="/icons/bac.svg"
          alt="bac device image"
          width={3000}
          height={3000}
        />
        <br />
        <br />
        <br />
        {!deviceStatus && (
          <p className="" style={{ color: "#4E555D", textAlign: "center" }}>
            Press the “Connect” button and turn on the BAC device.
          </p>
        )}
        {deviceStatus && (
          <p className="" style={{ color: "#4E555D", textAlign: "center" }}>
            Turn on the BAC device
          </p>
        )}
        <br />
        <br />
        {!deviceStatus && (
          <Button
            blue
            style={{ width: "292px" }}
            onClick={handleDeviceConnection}
          >
            {"Connect"}
          </Button>
        )}
      </div>
    </>
  );
};

export default BacConnectDevice;
