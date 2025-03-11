"use client";

import {
  AgreementHeader,
  AppContainer,
  AppHeader,
  DesktopFooter,
} from "@/components";
import Image from "next/image";
import { useRef, useState } from "react";

const Desktop = () => {
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
      header={<AppHeader title="Device Setup" hasMute={true}  onClickMute={toggleMute} muted={muted} />}
      body={
        <div className="test-items-wrap-desktop_" style={{ textAlign: "left" }}>
          <div className="sub-item">
            <div style={{ minHeight: "10px" }}>
              <p className="get-started-title bold-action-word">
                Getting Started
              </p>
              <br />
              <ul style={{ textAlign: "left" }}>
                <li>Find a clear workspace and take your seat.</li> <br />
                <li>
                  Please remember that you will need approximately 20
                  uninterrupted minutes.
                </li>
                <br />
                <li>Set your phone to DO NOT Disturb and turn OFF Alarms.</li>
                <br />
                <li>
                  Incoming calls and message alerts will interrupt your
                  collection and make the collection invalid.
                </li>
                <br />
                <li>Confirm you are in the Do Not Disturb setting.</li>
                <br />
                <li>
                  Note your Participant ID and today`s date, as they may be
                  needed during the collection.
                </li>
                <br />
              </ul>
            </div>
          </div>
          <div
            className="wrap-img"
            style={{ backgroundImage: "url('/images/device-set.svg')" }}
          />
        <audio ref={audioRef} src="/audio/getting_started.mp3" controls={false} muted={muted} autoPlay />

        </div>
      }
      footer={
        <DesktopFooter
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

export default Desktop;
