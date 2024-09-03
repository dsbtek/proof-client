import { AppHeader, AgreementFooter } from "@/components";
import { formatList } from "@/utils/utils";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import Image from "next/image";


const MobileView = ({
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
            {/* <div className="test-head">
                <AppHeader title={currentScreen?.[`Screen_${currentScreenIndex_}_Title`] || ""} />
                <div className="test-audio">
                    {muted ? (
                        <GoMute onClick={muteAudio} color="#adadad" style={{ cursor: "pointer" }} />
                    ) : (
                        <RxSpeakerLoud onClick={muteAudio} color="#009cf9" style={{ cursor: "pointer" }} />
                    )}
                </div>
            </div> */}
            <div style={{ display: 'flex', alignItems: "center", width: '100%' }}>
                <AppHeader title={currentScreen?.[`Screen_${currentScreenIndex_}_Title`] || ""} />
                <div className='test-audio'>
                    {muted ? <GoMute onClick={muteAudio} color='#adadad' style={{ cursor: 'pointer' }} /> : <RxSpeakerLoud onClick={muteAudio} color='#009cf9' style={{ cursor: 'pointer' }} />}
                </div>
            </div>
            <div className="agreement-items-wrap">
                {currentScreen?.[`Screen_${currentScreenIndex_}_Image_URL`] && (
                    <div className="wrap-prescreen-img">
                        <Image
                            className="get-started-img"
                            src={currentScreen[`Screen_${currentScreenIndex_}_Image_URL`]}
                            alt="Screen Image"
                            width={3000}
                            height={3000}
                        />
                    </div>
                )}
                <div className="prescreen-text">
                    <p
                        className="screen-content"
                        dangerouslySetInnerHTML={{ __html: formatList(currentScreen?.[`Screen_${currentScreenIndex_}_Content`] || "") }}
                    />
                </div>
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
        </>
    )
};

export default MobileView;
