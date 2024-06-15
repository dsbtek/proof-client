"use client";

import { useEffect, useState } from "react";
import { useBattery } from 'react-use';
import Image from "next/image";

import { AppHeader, Button, Menu, MiniLoader } from "@/components";
import { checkAvailableStorage, /*FastTest,*/ generateSystemChecks } from "@/utils/utils";


const SystemCheck = () => {
  const battery = useBattery();
  const deviceBatteryLevel = battery.isSupported && battery.fetched ? parseFloat((battery.level * 100).toFixed(0)) : 0;
  const [storageLevel, setStorageLevel] = useState<number>(0);
  const [internetSpeed, setInternetSpeed] = useState("0kb/0kb");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [systemChecks, setSystemChecks] = useState([
    {
      imgUrl: '',
      title: "Battery Life is at least 50%",
      subTitle: "pending...",
      status: 'fail',
    },
    {
      imgUrl: '',
      title: "At least 1GB of storage available",
      subTitle: "pending...",
      status: 'fail',
    },
    {
      imgUrl: '',
      title: "Strong network signal",
      subTitle: "pending...",
      status: 'fail',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const storage = await checkAvailableStorage() as unknown as number;
      setStorageLevel(storage!);

      setSystemChecks(await generateSystemChecks(deviceBatteryLevel, storageLevel, internetSpeed, downloadSpeed));
    };
    fetchData();
  }, [deviceBatteryLevel, downloadSpeed, internetSpeed, storageLevel]);


  return (
    <div className="container-test-collection">
      <AppHeader title={"System Check"} />
      <div className="system-check-items">
        {systemChecks.map((check, index) => (
          <div className="system-check-list" key={index}>
            {check.imgUrl === "" ? <MiniLoader size='40px' /> : <Image src={check.imgUrl} alt="image" width={5000} height={5000} loading='lazy' className="sys-chk-icon" />}
            <div className="wrap-title">
              <p className="system-check-title">{check.title}</p>
              {check.status === 'pass' ? (
                <p className="system-check-sub-title">{check.subTitle}</p>
              ) : (
                <p className="system-check-sub-title-check-bad">{check.subTitle}</p>
              )}
            </div>
          </div>
        ))}
        <div style={{ width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '32px' }}>
          <Button blue type="submit" link="/test-collection/agreement">Next</Button>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default SystemCheck;