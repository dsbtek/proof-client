"use client";

import { AgreementHeader, DesktopFooter } from "@/components";
import Image from "next/image";

const Desktop = () => {

  return (
    <div className="agreement-container">
      <AgreementHeader title="Device Setup" />
      <div className="test-items-wrap-desktop_" style={{ textAlign: "left" }}>
          <div className="sub-item">
          <p className="get-started-title bold-action-word">
              Getting Started
            </p>
          <br />
          <ul style={{ textAlign: "left" }}>
            <li>Find a clear workspace and take your seat.</li> <br />
            <li>Please remember that you will need approximately 20 uninterrupted minutes.</li><br />
            <li>Set your phone to DO NOT Disturb and turn OFF Alarms.</li><br />
            <li>Incoming calls and message alerts will interrupt your collection and make the collection invalid.</li><br />
            <li>Confirm you are in the Do Not Disturb setting.</li><br />
            <li>Note your Participant ID and today`s date, as they may be needed during the collection.</li><br />
            </ul>
          </div>
          <Image className="get-started-img" src="/images/dxtgt.svg" alt="image" width={3000} height={3000} />
        </div>

        <DesktopFooter
        currentNumber={3}
        outOf={5}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink={"/test-collection/signature"}
        btnRightLink={"/test-collection/before-you-begin"}
        btnLeftText={"Back"}
        btnRightText={"Next"} />:
    </div>
  );
};

export default Desktop;
