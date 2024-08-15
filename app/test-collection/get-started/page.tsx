

"use client";
import React, { useEffect, useState } from "react";
import { AgreementHeader, AgreementFooter, Button } from "@/components";
import Image from "next/image";



const GetStarted = () => {
  const [sigCanvasH, setSigCanvasH] = useState(0);

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 700) {
        setSigCanvasH(250);
      } else {
        setSigCanvasH(700);
      }
    };
    routeBasedOnScreenSize();
    window.addEventListener('resize', routeBasedOnScreenSize);
    return () => window.removeEventListener('resize', routeBasedOnScreenSize);
  }, []);
  return (
    <div className="container-test-collection">
      <AgreementHeader title="Device Setup" />
      {sigCanvasH !== 700 ?
        <div className="agreement-items-wrap">
          <Image className="get-started-img" src="/images/getting-started.svg" alt="image" width={3000} height={3000} />
          <p className="get-started-title">
            Getting Started
          </p>
          <ul>
            <li>Find a clear workspace and take your seat.</li>
            <li>Please remember that you will need approximately 20 uninterrupted minutes.</li>
            <li>Set your phone to DO NOT Disturb and turn OFF Alarms.</li>
            <li>Incoming calls and message alerts will interrupt your collection and make the collection invalid.</li>
            <li>Confirm you are in the Do Not Disturb setting.</li>
            <li>Note your Participant ID and today`s date, as they may be needed during the collection.</li>
          </ul>
        </div> :
        <div className="test-items-wrap-desktop_">
          <div className="sub-item">
            <p className="get-started-title">
              Getting Started
            </p>
            <ul>
              <li>Find a clear workspace and take your seat.</li>
              <li>Please remember that you will need approximately 20 uninterrupted minutes.</li>
              <li>Set your phone to DO NOT Disturb and turn OFF Alarms.</li>
              <li>Incoming calls and message alerts will interrupt your collection and make the collection invalid.</li>
              <li>Confirm you are in the Do Not Disturb setting.</li>
              <li>Note your Participant ID and today`s date, as they may be needed during the collection.</li>
            </ul>
          </div>
          <Image className="get-started-img" src="/images/dxtgt.svg" alt="image" width={3000} height={3000} />
        </div>
      }
      <AgreementFooter
        currentNumber={3}
        outOf={5}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink={"/test-collection/signature"}
        btnRightLink={"/test-collection/before-you-begin"}
        btnLeftText={"Back"}
        btnRightText={"Next"} />
    </div>
  );
};

export default GetStarted;
