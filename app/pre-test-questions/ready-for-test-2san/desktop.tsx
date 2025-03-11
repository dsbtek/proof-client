import { AppContainer, AppHeader, DesktopFooter } from '@/components';
import { preTestTotalSteps_ } from '@/redux/slices/appConfig';
import { formatList } from '@/utils/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
    const [step, setStep] = useState(3);
    const totalSteps = useSelector(preTestTotalSteps_);
    // Type guard to ensure currentScreenIndex_ is a valid number
    const screenTitle =
        currentScreenIndex_ !== undefined
            ? currentScreen?.[`Screen_${currentScreenIndex_}_Title`]
            : '';

    const screenImageUrl =
        currentScreenIndex_ !== undefined
            ? currentScreen?.[`Screen_${currentScreenIndex_}_Image_URL`]
            : '';

    const screenContent =
        currentScreenIndex_ !== undefined
            ? currentScreen?.[`Screen_${currentScreenIndex_}_Content`]
            : '';

    const screenAudioUrl =
        currentScreenIndex_ !== undefined
            ? currentScreen?.[`Screen_${currentScreenIndex_}_Audio_URL`]
            : '';
    const moveNext = () => {
        handleNext();
        setStep(step + 1);
    };

    const moveBack = () => {
        handlePrev();
        setStep(step - 1);
    };

    useEffect(() => {
        if (step < 3) {
            setStep(3);
        }
    });

    return (
        <AppContainer
            header={
                <AppHeader
                    title={
                        currentScreen?.[
                            `Screen_${currentScreenIndex_}_Title`
                        ] || ''
                    }
                    hasMute={true}
                    muted={muted}
                    onClickMute={muteAudio}
                />
            }
            body={
                <div className="test-items-wrap-desktop_">
                    <div className="sub-item">
                        <p
                            className="screen-content"
                            dangerouslySetInnerHTML={{
                                __html: formatList(screenContent || ''),
                            }}
                        />
                    </div>
                    {screenImageUrl && (
                        <div
                            className="wrap-img"
                            style={{
                                backgroundImage: `url(${screenImageUrl})`,
                            }}
                        />
                    )}
                    {currentScreen?.[
                        `Screen_${currentScreenIndex_}_Audio_URL`
                    ] && (
                        <audio
                            ref={audioRef}
                            src={
                                currentScreen[
                                    `Screen_${currentScreenIndex_}_Audio_URL`
                                ]
                            }
                            controls={false}
                            autoPlay
                        />
                    )}
                </div>
            }
            footer={
                <DesktopFooter
                    currentNumber={step}
                    outOf={totalSteps}
                    onPagination={true}
                    onLeftButton={currentScreenIndex > 1}
                    onRightButton={true}
                    btnLeftText="Previous"
                    btnRightText="Next"
                    btnRightLink={
                        currentScreenIndex === screensData.length - 1
                            ? pathLink()
                            : ''
                    }
                    onClickBtnLeftAction={moveBack}
                    onClickBtnRightAction={moveNext}
                    onProgressBar={true}
                />
            }
        />
    );
};

export default DesktopView;
