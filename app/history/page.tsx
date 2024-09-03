"use client";
import React from "react";

import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import DesktopHistory from "./desktopPage";
import MobileHistory from "./mobile";

function Page() {
  const device = useGetDeviceInfo();

  return (
    <div>
      {device?.screenWidth > 700 ? <DesktopHistory /> : <MobileHistory />}
    </div>
  );
}

export default Page;
