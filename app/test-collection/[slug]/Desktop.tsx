import {
    AppHeaderDesktop,
    TestDesktopFooter,
    // Scanner,
    Timer,
    Button,
    IdTimer,
    Scanner,
} from '@/components';
import { GoMute } from 'react-icons/go';
import { RxSpeakerLoud } from 'react-icons/rx';
import Image from 'next/image';
import React, {
    LegacyRef,
    RefObject,
    useCallback,
    useEffect,
    useState,
} from 'react';
import VideoElement from './VideoElement';
import { TbCapture } from 'react-icons/tb';
import { FiEdit } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import {
    saveBarcode,
    setBarcodeKit,
    setDetectKit,
    setTrackingNumber,
} from '@/redux/slices/drugTest';
import { CgChevronLeft } from 'react-icons/cg';
import ZxingBarcodeScanner from '@/components/zxingScanner/ZxingBarcodeScanner';
import { hasText } from '@/utils/utils';
import { number } from 'yup';

type Props = {
    muteAudio: () => void;
    muted: boolean;
    handleDialog: () => void;
    showBCModal: boolean;
    setShowBCModal?: (show: boolean) => void;
    scanType: string;
    barcodeUploaded: boolean;
    activeStep: number;
    test: any[];
    showTimer: boolean;
    time: number;
    handleTimerEnd: () => void;
    reCaptureBarcode: () => void;
    closeBCModal: () => void;
    setToggleContent: (toggle: boolean) => void;
    repeatAudio: () => void;
    performLabelScan: boolean;
    handleNextStep: () => void;
    videoRef: RefObject<HTMLVideoElement | null>;
    kitName: string;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    // videoComponent: JSX.Element;
    videoStream: MediaStream | null;
    barcodeIsLoading: boolean;
    barcodeCapture: () => Promise<void>;
    barcodeValue: string;
    setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
    setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
    enterBarcode: boolean;
    capturing: boolean;
    setEnterBarcode: React.Dispatch<React.SetStateAction<boolean>>;
    capturedImage?: HTMLImageElement | null;
    setCapturedImage?: React.Dispatch<
        React.SetStateAction<HTMLImageElement | null>
    >;
    faceDetected?: boolean;
    capturedImageTrigger?: () => Promise<void> | undefined;
    trackImageCapture: string;
    setTrackImageCapture: React.Dispatch<React.SetStateAction<string>>;
    // captureManualImage: boolean;
    // setCaptureManualImage: React.Dispatch<React.SetStateAction<boolean>>;
    startManualCaptureFn: (timeLimit: number) => Promise<void>;
    manualImageCaptureTimer: number;
    removeCapturedImage: () => void;
};

const DesktopTestView = ({
    muteAudio,
    muted,
    handleDialog,
    showBCModal,
    setShowBCModal,
    scanType,
    barcodeUploaded,
    activeStep,
    test,
    showTimer,
    time,
    handleTimerEnd,
    reCaptureBarcode,
    closeBCModal,
    repeatAudio,
    handleNextStep,
    videoRef,
    isPrevDisabled,
    isNextDisabled,
    kitName,
    performLabelScan,
    videoStream,
    barcodeCapture,
    barcodeIsLoading,
    enterBarcode,
    setEnterBarcode,
    barcodeValue,
    setBarcodeValue,
    capturedImage,
    setCapturedImage,
    faceDetected,
    setCapturing,
    capturing,
    capturedImageTrigger,
    trackImageCapture,
    setTrackImageCapture,
    startManualCaptureFn,
    manualImageCaptureTimer,
    removeCapturedImage,
}: Props) => {
    const dispatch = useDispatch();

    const [capturedManual, setCapturedManual] = useState(false);
    const barcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const barcodeInput = e.target.value;
        setBarcodeValue(barcodeInput);
        scanType === 'test' && dispatch(saveBarcode(barcodeInput));
        scanType === 'fedex' && dispatch(setTrackingNumber(barcodeInput));
        scanType === 'kit' && dispatch(setBarcodeKit(barcodeInput));
        scanType === 'detect' && dispatch(setDetectKit(barcodeInput));
    };

    const handleCaptureBarcode = async () => {
        setCapturedImage?.(null);
        await startManualCaptureFn(5);
        setCapturedManual(true);
    };
    const handleSaveBarcode = async () => {
        scanType === 'test' && dispatch(saveBarcode(barcodeValue as string));
        scanType === 'fedex' &&
            dispatch(setTrackingNumber(barcodeValue as string));
        scanType === 'kit' && dispatch(setBarcodeKit(barcodeValue as string));
        scanType === 'detect' && dispatch(setDetectKit(barcodeValue as string));
        setEnterBarcode(false);
        setCapturing(false);

        closeBCModal();
    };

    const barcodeValidator = useCallback(
        (barcode: string) => {
            return performLabelScan ? !Number.isNaN(Number(barcode)) : true;
        },
        [performLabelScan],
    );

    useEffect(() => {
        if (!showBCModal) setCapturing(false);
    }, [showBCModal, setCapturing]);
    return (
        <>
            <div
                className="test-content"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    flexGrow: 1,
                }}
            >
                <div
                    className="test-head"
                    style={{ height: '10vh', maxHeight: '100px' }}
                >
                    <AppHeaderDesktop
                        handleDialog={handleDialog}
                        title={kitName}
                    />
                    <div className="test-audio">
                        {muted ? (
                            <GoMute
                                onClick={muteAudio}
                                color="#adadad"
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <RxSpeakerLoud
                                onClick={muteAudio}
                                color="#009cf9"
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                    </div>
                </div>
                <div
                    className="wrap-content-cam"
                    style={{ flexGrow: 1, height: '80vh' }}
                >
                    <div
                        className="test-details"
                        style={{
                            flexGrow: 1,
                            height: 'auto',
                            marginLeft: '16px',
                        }}
                    >
                        {test.map((step: any, index: number) => {
                            if (
                                activeStep === step.step &&
                                step.step !== null
                            ) {
                                return (
                                    <React.Fragment key={index}>
                                        <div
                                            className="test-graphic_"
                                            key={index + 2}
                                            style={{
                                                position: 'relative',
                                                flexGrow: 1,
                                                backgroundColor: '#eaeaea',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderRadius: '16px 0 0 16px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div className="test-text scroller">
                                                <article className="test-step_">
                                                    <h5>Step {step.step}</h5>
                                                </article>
                                                <p
                                                    className="t-text"
                                                    style={{
                                                        height: 'fit-content',
                                                        // overflowY: "auto",
                                                    }}
                                                >
                                                    {hasText(step.browser_text)
                                                        ? step.browser_text
                                                        : step.directions}
                                                </p>

                                                {step?.is_barcode &&
                                                    //   !barcodeUploaded &&
                                                    !enterBarcode && (
                                                        <div className="desktop-test-barcode-btns">
                                                            {barcodeIsLoading ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        classname="man-btn"
                                                                        onClick={() => {
                                                                            setCapturedImage?.(
                                                                                null,
                                                                            );
                                                                            setEnterBarcode(
                                                                                true,
                                                                            );
                                                                            setCapturing(
                                                                                false,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FiEdit />{' '}
                                                                        Enter
                                                                        Manually
                                                                    </Button>
                                                                    <Button
                                                                        classname="cap-btn"
                                                                        onClick={() => {
                                                                            setBarcodeValue(
                                                                                '',
                                                                            );
                                                                            setEnterBarcode(
                                                                                false,
                                                                            );
                                                                            setCapturing(
                                                                                true,
                                                                            );
                                                                            // barcodeCapture();
                                                                            setShowBCModal?.(
                                                                                true,
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            capturing
                                                                        }
                                                                    >
                                                                        <TbCapture />{' '}
                                                                        Capture
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                {step?.is_capture_image && (
                                                    <div className="desktop-test-barcode-btns">
                                                        <>
                                                            {trackImageCapture ? (
                                                                <Button
                                                                    classname="man-btn"
                                                                    onClick={() => {
                                                                        setTrackImageCapture(
                                                                            '',
                                                                        );
                                                                        removeCapturedImage();
                                                                    }}
                                                                >
                                                                    <FiEdit />{' '}
                                                                    Re-Capture
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    classname="cap-btn"
                                                                    onClick={
                                                                        capturedImageTrigger
                                                                    }
                                                                    disabled={
                                                                        capturing
                                                                    }
                                                                >
                                                                    <TbCapture />{' '}
                                                                    Capture
                                                                </Button>
                                                            )}
                                                        </>
                                                    </div>
                                                )}

                                                {performLabelScan &&
                                                    //   !barcodeUploaded &&
                                                    !enterBarcode && (
                                                        <div className="desktop-test-barcode-btns">
                                                            {barcodeIsLoading ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        classname="man-btn"
                                                                        onClick={() => {
                                                                            setEnterBarcode(
                                                                                true,
                                                                            );
                                                                            setCapturing(
                                                                                false,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FiEdit />{' '}
                                                                        Enter
                                                                        Manually
                                                                    </Button>
                                                                    <Button
                                                                        classname="cap-btn"
                                                                        onClick={() => {
                                                                            setBarcodeValue(
                                                                                '',
                                                                            );
                                                                            setEnterBarcode(
                                                                                false,
                                                                            );
                                                                            setCapturing(
                                                                                true,
                                                                            );
                                                                            // barcodeCapture();
                                                                            setShowBCModal?.(
                                                                                true,
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            capturing
                                                                        }
                                                                    >
                                                                        <TbCapture />{' '}
                                                                        Capture
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                {enterBarcode &&
                                                    (performLabelScan ||
                                                        step?.is_barcode) && (
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                flexDirection:
                                                                    'column',
                                                                gap: '8px',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    fontSize:
                                                                        '1rem',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => {
                                                                    setCapturedImage?.(
                                                                        null,
                                                                    );
                                                                    setBarcodeValue(
                                                                        '',
                                                                    );
                                                                    setEnterBarcode(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                <CgChevronLeft />
                                                                &nbsp;Back
                                                            </div>
                                                            <div className="manually-input-row">
                                                                <input
                                                                    className="bc-input"
                                                                    type="text"
                                                                    placeholder="Enter Barcode or N/A, if no barcode is present."
                                                                    onChange={
                                                                        barcodeInput
                                                                    }
                                                                />
                                                                <Button
                                                                    classname="td-right"
                                                                    onClick={
                                                                        capturedImage
                                                                            ? handleSaveBarcode
                                                                            : handleCaptureBarcode
                                                                    }
                                                                    disabled={
                                                                        barcodeValue ===
                                                                            '' &&
                                                                        !capturedImage
                                                                    }
                                                                    style={{
                                                                        height: '100%',
                                                                    }}
                                                                >
                                                                    {(() => {
                                                                        if (
                                                                            capturedImage
                                                                        )
                                                                            return 'Confirm';
                                                                        if (
                                                                            enterBarcode &&
                                                                            manualImageCaptureTimer >
                                                                                0
                                                                        ) {
                                                                            return `Capture ${manualImageCaptureTimer}`;
                                                                        }
                                                                        return 'Capture';
                                                                    })()}
                                                                </Button>
                                                                {capturedImage && (
                                                                    <Button
                                                                        classname="td-left"
                                                                        onClick={
                                                                            handleCaptureBarcode
                                                                        }
                                                                        disabled={
                                                                            barcodeValue ===
                                                                                '' ||
                                                                            manualImageCaptureTimer >
                                                                                0
                                                                        }
                                                                        style={{
                                                                            height: '100%',
                                                                        }}
                                                                    >
                                                                        Recapture
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '50%',
                                                    backgroundImage: `url("/images/proof-background-test.png")`,
                                                    backgroundSize: 'cover',
                                                }}
                                            >
                                                <Image
                                                    className="test-graphic"
                                                    src={
                                                        trackImageCapture &&
                                                        step?.is_capture_image
                                                            ? trackImageCapture
                                                            : step.image_path
                                                    }
                                                    alt="Proof Test Image"
                                                    priority
                                                    unoptimized
                                                    placeholder="blur"
                                                    blurDataURL="image/png"
                                                    objectFit="contain"
                                                    layout="fit"
                                                />
                                            </div>
                                            {showTimer && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        height: '50%',
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <Timer
                                                        time={time}
                                                        showTimer={showTimer}
                                                        handleEnd={
                                                            handleTimerEnd
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div
                        className="camera-container-new"
                        style={{
                            display: 'flex',
                            height: 'auto !important',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexGrow: 1,
                            paddingRight: '16px',
                        }}
                    >
                        {/* <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "rgba(12, 22, 23, 0.8)",
                padding: 8,
                borderRadius: "80px",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                zIndex: 99,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "70px",
                  width: "15px",
                  height: "15px",
                  padding: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "red",
                    borderRadius: "20px",
                  }}
                />
              </div>
              <p style={{ fontSize: "0.65rem", color: "white" }}>
                Video Recording
              </p>
            </div> */}
                        {/* {videoComponent} */}

                        {showBCModal && capturing && (
                            <div className="desktop-scanner">
                                {!performLabelScan ? (
                                    <Scanner
                                        show={showBCModal}
                                        scanType={scanType}
                                        // barcodeUploaded={barcodeUploaded}
                                        recapture={false}
                                        closeModal={closeBCModal}
                                        barcode={barcodeValue}
                                        setBarcode={setBarcodeValue}
                                        captureImageFn={barcodeCapture}
                                        capturedImage={capturedImage}
                                        setEnterManual={setEnterBarcode}
                                        manualImageCaptureTimer={
                                            manualImageCaptureTimer
                                        }
                                        startManualCaptureFn={
                                            startManualCaptureFn
                                        }
                                    />
                                ) : (
                                    <ZxingBarcodeScanner
                                        show={showBCModal}
                                        scanType={scanType}
                                        // barcodeUploaded={barcodeUploaded}
                                        recapture={false}
                                        closeModal={closeBCModal}
                                        barcode={barcodeValue}
                                        setBarcode={setBarcodeValue}
                                        captureImageFn={barcodeCapture}
                                        capturedImage={capturedImage}
                                        setEnterManual={setEnterBarcode}
                                        manualImageCaptureTimer={
                                            manualImageCaptureTimer
                                        }
                                        startManualCaptureFn={
                                            startManualCaptureFn
                                        }
                                        barcodeValidator={barcodeValidator}
                                    />
                                )}
                            </div>
                        )}
                        {/* {enterBarcode && manualImageCaptureTimer > 0 && (
              <div className="timer-container">
                <IdTimer timeLeft={manualImageCaptureTimer} />
              </div>
            )} */}
            {capturedImage &&
              barcodeValue !== "" &&
              enterBarcode &&
              performLabelScan && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage?.src}
                  alt="Captured"
                  style={{
                    width: "100%",
                    // height: isDesktop ? "calc(100% - 80px)" : "100%",
                    // position: "absolute",
                    height: "100%",
                    bottom: 0,
                    zIndex: 99,
                    transform: "scaleX(-1)",
                  }}
                />
              )}

                        <VideoElement
                            ref={videoRef as LegacyRef<HTMLVideoElement>}
                            stream={videoStream}
                            faceDetected={faceDetected}
                            autoPlay
                            muted
                            playsInline
                            style={{ borderRadius: '0 16px 16px 0' }}
                        />
                        {/* <div style={frameStyle as any}>
              {faceDetected ? (
                <Image
                  className="detection-image"
                  src="/images/face-detected-green.png"
                  alt="captured Image"
                  width={2000}
                  height={2000}
                />
              ) : (
                <Image
                  className="detection-image"
                  src="/images/face-no-detected-red.png"
                  alt="captured Image"
                  width={2000}
                  height={2000}
                />
              )}
            </div> */}
                    </div>
                </div>
            </div>
            <TestDesktopFooter
                currentNumber={activeStep}
                outOf={test.length}
                btnLeftText={'Repeat'}
                btnRightText={showTimer ? 'Wait...' : 'Next'}
                rightdisabled={isNextDisabled}
                leftdisabled={isPrevDisabled}
                onClickBtnLeftAction={repeatAudio}
                onClickBtnRightAction={handleNextStep}
                onProgressBar={true}
            />
        </>
    );
};
export default DesktopTestView;
