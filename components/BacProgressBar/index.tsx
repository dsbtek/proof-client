"use client";

import React, { useEffect, useState } from "react";
import MiniLoader from "../loaders/miniLoader";
import { useRouter } from "next/navigation";
import Button from "../button";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";

interface ProgressBarProps {
  progress: number;
  onClick: () => void;
  result?: boolean;
}

const ProgressBar = ({ progress, onClick, result }: ProgressBarProps) => {
  const router = useRouter();
  const device = useGetDeviceInfo();
  // console.log(result);

  let message = "";

  if (progress === 0) {
    message = "Warming Up";
  } else if (progress > 0 && progress < 100) {
    message = "Keep Blowing";
  } else if (progress === 100) {
    message = "Analyzing Results";
    setTimeout(() => { }, 3000);
  }

  return (
    <div className={"progressBarContainer"} onClick={onClick}>
      {!result && <p>{message}</p>}
      {result &&
        (device?.screenWidth < 700 ? (
          <p>Results: 0.0000 BAC Negative</p>
        ) : (
          <p>Result</p>
        ))}
      {(!result || (result && device?.screenWidth > 700)) && (
        <div
          className={"progressBar"}
          style={{ backgroundImage: `url("/images/progress-ruler.svg")` }}
        >
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress === 100 && !result && <MiniLoader />}
            {/* {progress}% */}
          </div>
        </div>
      )}
      {result && device?.screenWidth < 700 && (
        <Button
          blue
          style={{ width: "292px", height: "44px!important" }}
          link="/home"
        >
          {"Continue"}
        </Button>
      )}
    </div>
  );
};

export default ProgressBar;
