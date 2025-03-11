"use client";

import { AgreementHeader, AgreementFooter, AppContainer, AppHeader } from "@/components";

import Image from "next/image";
import { useRef, useState } from "react";

const GetStarted = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };
  return (

    <AppContainer
      header={
        <AppHeader title="Device Setup" hasMute={true}  onClickMute={toggleMute} muted={muted} />
      }
      body={
        <div className="agreement-items-wrap">
        <Image
          className="get-started-img"
            src="/images/device-setup-mobile.svg"
          alt="image"
          width={3000}
          height={3000}
        />
        <p className="get-started-title">Getting Started</p>
        <ul>
          <li>Find a clear workspace and take your seat.</li>
          <li>
            Please remember that you will need approximately 20 uninterrupted
            minutes.
          </li>
          <li>Set your phone to DO NOT Disturb and turn OFF Alarms.</li>
          <li>
            Incoming calls and message alerts will interrupt your collection and
            make the collection invalid.
          </li>
          <li>Confirm you are in the Do Not Disturb setting.</li>
          <li>
            Note your Participant ID and today`s date, as they may be needed
            during the collection.
          </li>
        </ul>
        <audio ref={audioRef} src="/audio/getting_started.mp3" controls={false} muted={muted} autoPlay />

      </div>
      }
      footer={
        <AgreementFooter
        currentNumber={3}
        outOf={5}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink={"/test-collection/signature"}
        btnRightLink={"/test-collection/before-you-begin"}
        btnLeftText={"Back"}
        btnRightText={"Next"}
      />
      }
    />
  );
};

export default GetStarted;
