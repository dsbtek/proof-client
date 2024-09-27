"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";

import { AppHeader, Button, DinamicMenuLayout, Switch } from "@/components";
import { setCookie } from "@/utils/utils";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import { appData } from "@/redux/slices/appConfig";

function ApplicationSettings() {
  const welcomeCookie = Cookies.get("welView");
  const [checked, setChecked] = useState(
    welcomeCookie === "true" ? true : false
  );
  const router = useRouter();
  const { permissions } = useSelector(appData);
  const appPermissions = permissions ? permissions.split(";") : undefined;

  const handleSwitch = () => {
    if (welcomeCookie === "false") {
      setCookie("welView", "true", 2000);
      setChecked(true);
    } else {
      setCookie("welView", "false", 2000);
      setChecked(false);
    }
  };

  const device = useGetDeviceInfo();

  return (
    <DinamicMenuLayout>
      <div className="tutorial-container application-settings-container ">
        {/* <div className="container"> */}
        {/* <div className="items-wrap"> */}
        {device?.screenWidth < 700 && (
          <AppHeader title="Application Settings" />
        )}
        <div className="dex-only back-button" onClick={() => router.back()}>
          <Image
            className=""
            src="/icons/back.svg"
            alt="captured Image"
            width={16}
            height={16}
            loading="lazy"
          />
          <p>Back</p>
        </div>
        <div className="dex-only title-sub-container">
          <h4 className="set-sec-title">Application Settings</h4>
          <p className="settings-title-subtext">
            Adjust your application preferences and settings below to customize
            your experience.
          </p>
        </div>
        <div className="app-toggles">
          <div className="toggle-tutorial">
            <p style={{ width: "80%" }}>Show Welcome Tutorial</p>
            <Switch onToggle={handleSwitch} checked={checked} />
          </div>
          {/* <div className="toggle-tutorial">
            <p>Email Notifications</p>
            <Switch onToggle={handleSwitch} checked={checked} />
          </div> */}
        </div>
        {appPermissions && appPermissions.includes("Admin") && <Button blue onClick={() => router.push('/config')} style={{ marginTop: '50px', width: '10rem', height: '3rem' }}>
          Configure AI
        </Button>}
      </div>
    </DinamicMenuLayout>
  );
}

export default ApplicationSettings;
