import { AgreementHeader, AppHeader, DesktopFooter } from "@/components";
import { formatList } from "@/utils/utils";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import Image from "next/image";

const DesktopView = ({
    currentScreen,
    currentScreenIndex_,
    currentScreenIndex,
    screensData,
    handlePrev,
    handleNext,
    pathLink,
    muted,
    muteAudio,
    audioRef,
}: PreTestScreensProps) => {
    // Type guard to ensure currentScreenIndex_ is a valid number
    const screenTitle = currentScreenIndex_ !== undefined
        ? currentScreen?.[`Screen_${currentScreenIndex_}_Title`]
        : "";

    const screenImageUrl = currentScreenIndex_ !== undefined
        ? currentScreen?.[`Screen_${currentScreenIndex_}_Image_URL`]
        : "";

    const screenContent = currentScreenIndex_ !== undefined
        ? currentScreen?.[`Screen_${currentScreenIndex_}_Content`]
        : "";

    const screenAudioUrl = currentScreenIndex_ !== undefined
        ? currentScreen?.[`Screen_${currentScreenIndex_}_Audio_URL`]
        : "";

    return (
        <>
            {/* <AgreementHeader title={screenTitle || ""} /> */}
            <div className="test-head">
                <AppHeader title={currentScreen?.[`Screen_${currentScreenIndex_}_Title`] || ""} />
                <div className="test-audio">
                    {muted ? (
                        <GoMute onClick={muteAudio} color="#adadad" style={{ cursor: "pointer" }} />
                    ) : (
                        <RxSpeakerLoud onClick={muteAudio} color="#009cf9" style={{ cursor: "pointer" }} />
                    )}
                </div>
            </div>
            <div className="test-items-wrap-desktop_">

                <div className="sub-item">
                    <p
                        className="screen-content"
                        dangerouslySetInnerHTML={{ __html: formatList(screenContent || "") }}
                    />
                </div>
                {screenImageUrl && (
                    // <div className="wrap-prescreen-img">
                    <Image
                        className="prescreen-img"
                        src={screenImageUrl}
                        alt="Screen Image"
                        width={5000}
                        height={5000}
                    />
                    // </div>
                )}

            </div>
            <DesktopFooter
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
        </>

    );
};

export default DesktopView;
