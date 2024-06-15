

"use client";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AgreementHeader, AgreementFooter, Button } from "@/components";
import Image from "next/image";

import Link from "next/link";



const GetStarted = () => {
  return (
    <div className="container-test-collection">
      <AgreementHeader title="" />
      <div className="agreement-items-wrap">
        <Image className="get-started-img" src="/images/bludnobg.png" alt="image" width={3000} height={3000} />
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
      <AgreementFooter currentNumber={3} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/test-collection/before-you-begin"} btnLeftText={"Decline"} btnRightText={"Next"} />
    </div>
  );
};

export default GetStarted;
