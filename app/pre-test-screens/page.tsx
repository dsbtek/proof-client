"use client";
import React, { useState, useRef, useEffect } from "react";
import { Loader_ } from "@/components";
import { useSelector } from "react-redux";
import { appData } from "@/redux/slices/appConfig";
import { transformScreensData } from "@/utils/utils";
import useResponsive from "@/hooks/useResponsive";
import DesktopView from "./desktop";
import MobileView from "./mobile";

const PreTestScreens = () => {
  const user = useSelector(appData);
  const photo = user?.photo;
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const screensData = useSelector((state: any) => state.preTest.preTestScreens);
  const [muted, setMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDesktop = useResponsive();

  const handleNext = () => {
    if (currentScreenIndex < screensData.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const muteAudio = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const pathLink = (): string => {
    return photo ? "/identity-profile/sample-facial-capture" : "/identity-profile/id-detection/step-1";
  };

  const currentScreen = screensData && screensData[currentScreenIndex];
  const currentScreenIndex_ = transformScreensData(currentScreen);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (currentScreenIndex_ === 1) {
      setCurrentScreenIndex(1);
    }
  }, [currentScreenIndex, currentScreenIndex_]);

  if (!currentScreenIndex_) {
    return <Loader_ />;
  }

  return (
    <div className="container-test-collection">
      {isDesktop ? (
        <DesktopView
          currentScreen={currentScreen}
          currentScreenIndex_={currentScreenIndex_}
          currentScreenIndex={currentScreenIndex}
          screensData={screensData}
          handlePrev={handlePrev}
          handleNext={handleNext}
          pathLink={pathLink}
          muted={muted}
          muteAudio={muteAudio}
          audioRef={audioRef}
        />
      ) : (
          <MobileView
            currentScreen={currentScreen}
            currentScreenIndex_={currentScreenIndex_}
            currentScreenIndex={currentScreenIndex}
            screensData={screensData}
            handlePrev={handlePrev}
            handleNext={handleNext}
            pathLink={pathLink}
            muted={muted}
            muteAudio={muteAudio}
            audioRef={audioRef}
          />
      )}
    </div>
  );
};
export default PreTestScreens;
