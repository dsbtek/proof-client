"use client";
import { useState, useEffect } from "react";
import UAParser from "ua-parser-js";

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
    screenWidth: typeof window !== "undefined" ? window.screen.width : 0,
    screenHeight: typeof window !== "undefined" ? window.screen.height : 0,
    devicePixelRatio:
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
  });

  useEffect(() => {
    const parser = new UAParser();
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    setDeviceInfo({
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      deviceModel: device.model,
      deviceType: device.type,
      deviceVendor: device.vendor,
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
