"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AgreementFooter, AppHeader, Loader_ } from "@/components";
import { useSelector } from "react-redux";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import { appData } from "@/redux/slices/appConfig";
import { formatList, transformScreensData } from "@/utils/utils";

const PreTestScreens = () => {
  const user = useSelector(appData);
  const photo = user?.photo;
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const screensData = useSelector((state: any) => state.preTest.preTestScreens);
  const [muted, setMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      <div style={{ display: "flex", width: "100%", padding: "16px" }}>
        <AppHeader title={currentScreen?.[`Screen_${currentScreenIndex_}_Title`] || ""} />
        <div className="test-audio">
          {muted ? (
            <GoMute onClick={muteAudio} color="#adadad" style={{ cursor: "pointer" }} />
          ) : (
            <RxSpeakerLoud onClick={muteAudio} color="#009cf9" style={{ cursor: "pointer" }} />
          )}
        </div>
      </div>
      <div className="agreement-items-wrap">
        {currentScreen?.[`Screen_${currentScreenIndex_}_Image_URL`] && (
          <Image
            className="get-started-img"
            src={currentScreen[`Screen_${currentScreenIndex_}_Image_URL`]}
            alt="Screen Image"
            width={3000}
            height={3000}
          />
        )}
        <p
          className="screen-content"
          dangerouslySetInnerHTML={{ __html: formatList(currentScreen?.[`Screen_${currentScreenIndex_}_Content`] || "") }}
        />
        {currentScreen?.[`Screen_${currentScreenIndex_}_Audio_URL`] && (
          <audio ref={audioRef} src={currentScreen[`Screen_${currentScreenIndex_}_Audio_URL`]} controls={false} autoPlay />
        )}
      </div>

      <AgreementFooter
        currentNumber={currentScreenIndex + 1}
        outOf={screensData.length}
        onPagination={true}
        onLeftButton={currentScreenIndex > 1}
        onRightButton={true}
        btnLeftText="Previous"
        btnRightText="Next"
        btnRightLink={currentScreenIndex === screensData.length - 1 ? pathLink() : ""}
        onClickBtnLeftAction={handlePrev}
        onClickBtnRightAction={handleNext}
      />
    </div>
  );
};

export default PreTestScreens;
