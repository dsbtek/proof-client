"use client";
import { useState, useEffect } from "react";
import UAParser from "ua-parser-js";
import platform from "platform";

interface DeviceInfo {
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
  deviceModel?: string;
  deviceType?: string;
  deviceVendor?: string;
}

const useGetDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    devicePixelRatio:
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
  });

  useEffect(() => {
    const parser = new UAParser();
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    setDeviceInfo({
      screenWidth: window.screen.width ?? "",
      screenHeight: window.screen.height ?? "",
      devicePixelRatio: window.devicePixelRatio ?? "",
      browserName:
        browser?.name || platform.parse(navigator.userAgent).name || "",
      browserVersion:
        browser?.version || platform.parse(navigator.userAgent).version || "",
      osName:
        os?.name || platform.parse(navigator.userAgent).os?.toString() || "",
      osVersion:
        os?.version || platform.parse(navigator.userAgent).os?.version || "",
      deviceModel:
        device?.model ||
        platform.parse(navigator.userAgent).os?.architecture?.toString() ||
        "",
      deviceType:
        device?.vendor || platform.parse(navigator.userAgent).product || "",
      deviceVendor:
        device?.vendor || platform.parse(navigator.userAgent).os?.family || "",
    });

    const handleResize = () => {
      setDeviceInfo((prevState) => ({
        ...prevState,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceInfo;
};

export default useGetDeviceInfo;
