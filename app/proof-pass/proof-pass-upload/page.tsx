"use client";

import React from "react";
import ProofPassUploadDesktop from "./desktop";
import ProofPassUpload from "./mobile";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";

const Page = () => {
  const device = useGetDeviceInfo();

  return (
    <>
      {device?.screenWidth > 700 ? (
        <ProofPassUploadDesktop />
      ) : (
        <ProofPassUpload />
      )}
    </>
  );
};

export default Page;
