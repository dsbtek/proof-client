import { AppHeader, Button, Header, IdTimer, Timer } from '@/components';
import { AiFillCloseCircle } from 'react-icons/ai';
import { GoMute } from 'react-icons/go';
import { RxSpeakerLoud } from 'react-icons/rx';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import IScannner from '@/components/scanditize/IOSScanner';
import Webcam from 'react-webcam';
import { MdOutlineCancel } from 'react-icons/md';
import VideoElement from './VideoElement';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { TbCapture } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import {
    saveBarcode,
    setBarcodeKit,
    setDetectKit,
    setTrackingNumber,
} from '@/redux/slices/drugTest';
import DdBarcodeScanner from '@/components/DdBarcodeScanner/DdBarcodeScanner';
import ZxingBarcodeScanner from '@/components/zxingScanner/ZxingBarcodeScanner';

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
    isPlaying: boolean;
    toggleContent: boolean;
    barcodeStep: boolean;
    handleTimerEnd: () => void;
    reCaptureBarcode: () => void;
    closeBCModal: () => void;
    setToggleContent: (toggle: boolean) => void;
    repeatAudio: () => void;
    performLabelScan: boolean;
    handleNextStep: () => void;
    videoRef: any;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    isScanditDisabled: boolean;
    cameraRef: React.RefObject<Webcam | null>;
    kitName: string;
    // videoComponent: JSX.Element;
    videoStream: MediaStream | null;
    barcodeIsLoading: boolean;
    barcodeCapture: () => Promise<void>;
    barcodeValue: string;
    setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
    enterBarcode: boolean;
    setEnterBarcode: React.Dispatch<React.SetStateAction<boolean>>;
    capturedImage?: HTMLImageElement | null;
    faceDetected?: boolean;
    capturedImageTrigger?: () => Promise<void> | undefined;
    trackImageCapture: string;
    setTrackImageCapture: React.Dispatch<React.SetStateAction<string>>;
    startManualCaptureFn: (timeLimit: number) => Promise<void>;
    manualImageCaptureTimer: number;
    removeCapturedImage: () => void;
};

const MobileTestView = ({
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
    isPlaying,
    toggleContent,
    barcodeStep,
    handleTimerEnd,
    reCaptureBarcode,
    closeBCModal,
    setToggleContent,
    repeatAudio,
    performLabelScan,
    handleNextStep,
    videoRef,
    cameraRef,
    isNextDisabled,
    isPrevDisabled,
    isScanditDisabled,
    kitName,
    videoStream,
    barcodeCapture,
    barcodeIsLoading,
    enterBarcode,
    setEnterBarcode,
    barcodeValue,
    setBarcodeValue,
    capturedImage,
    faceDetected,
    capturedImageTrigger,
    trackImageCapture,
    setTrackImageCapture,
    startManualCaptureFn,
    manualImageCaptureTimer,
    removeCapturedImage,
}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [capturedManual, setCapturedManual] = useState(false);
    const dispatch = useDispatch();

    const onClickCapture = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext('2d');
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the video frame to the canvas
            context!.drawImage(video, 0, 0);

            // Get the data URL of the canvas image
            const dataUrl = canvas.toDataURL('image/png');
            console.log(dataUrl, 'dataurl image canvas');
            setImageSrc(dataUrl);
        }
    };
    const onClickRecapture = () => {
        setImageSrc('');
    };

    const barcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const barcodeInput = e.target.value;
        setBarcodeValue(barcodeInput);
        scanType === 'test' && dispatch(saveBarcode(barcodeInput));
        scanType === 'fedex' && dispatch(setTrackingNumber(barcodeInput));
        scanType === 'kit' && dispatch(setBarcodeKit(barcodeInput));
        scanType === 'detect' && dispatch(setDetectKit(barcodeInput));
    };

    const handleCaptureBarcode = async () => {
        await startManualCaptureFn(5);
        setCapturedManual(true);
    };
    const handleSaveBarcode = () => {
        scanType === 'test' && dispatch(saveBarcode(barcodeValue as string));
        scanType === 'fedex' &&
            dispatch(setTrackingNumber(barcodeValue as string));
        scanType === 'kit' && dispatch(setBarcodeKit(barcodeValue as string));
        scanType === 'detect' && dispatch(setDetectKit(barcodeValue as string));
        setEnterBarcode(false);

        closeBCModal();
    };

    const barcodeValidator = useCallback(
        (barcode: string) => {
            return performLabelScan ? !Number.isNaN(Number(barcode)) : true;
        },
        [performLabelScan],
    );

    return (
        <div
            style={{
                width: '100%',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                // flexGrow: 1,
                padding: '8px',
                backgroundColor: 'white',
            }}
        >
            <div
                className="test-content"
                style={{
                    padding: '8px',
                    borderRadius: '24px',
                    backgroundColor: '#F4F7F8',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '10%',
                        padding: '12px',
                        top: 0,
                        left: 0,
                        zIndex: '1000',
                    }}
                >
                    <Header
                        title={kitName}
                        hasMute={true}
                        onClickMute={muteAudio}
                        muted={muted}
                        icon1={
                            <IoMdCloseCircle
                                color="#FF6566"
                                size={24}
                                onClick={handleDialog}
                            />
                        }
                    />
                </div>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt="Screenshot"
                        style={{
                            position: 'absolute',
                            width: '70vw',
                            height: '300px',
                            zIndex: '9999',
                            objectFit: 'contain',
                            left: 'calc(50vw - 35vw)',
                            top: '5.8rem',
                        }}
                        objectFit="contain"
                    />
                )}

                <div
                    style={{
                        width: '100%',
                        height: '40%',
                        borderRadius: '12px',
                    }}
                >
                    {/* Forward the ref to the video component */}
                    <VideoElement
                        ref={videoRef}
                        stream={videoStream}
                        faceDetected={faceDetected}
                        autoPlay
                        muted
                        playsInline
                        style={{ borderRadius: '12px' }}
                    />
                </div>
                <div className="test-details" style={{ height: '50%' }}>
                    {test.map((step: any, index: number) => {
                        if (activeStep === step.step && step.step !== null) {
                            return (
                                <React.Fragment key={index}>
                                    {!step?.is_barcode && !performLabelScan && (
                                        <div
                                            className="test-header"
                                            key={index + 1}
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <p className="test-steps">{`Step ${step.step} of ${test.length}`}</p>
                                            <div className="td-btns">
                                                <Button
                                                    disabled={isPrevDisabled}
                                                    classname="td-left"
                                                    onClick={repeatAudio}
                                                >
                                                    Repeat
                                                </Button>

                                                {step?.is_capture_image ? (
                                                    <div className="double-btns">
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
                                                                // disabled={capturing}
                                                            >
                                                                <TbCapture />{' '}
                                                                Capture
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="double-btns">
                                                        <Button
                                                            classname={
                                                                !toggleContent
                                                                    ? 'db-blue'
                                                                    : 'db-white'
                                                            }
                                                            style={{
                                                                borderTopLeftRadius:
                                                                    '8px',
                                                                borderBottomLeftRadius:
                                                                    '8px',
                                                            }}
                                                            onClick={() =>
                                                                setToggleContent(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Graphics
                                                        </Button>
                                                        <Button
                                                            classname={
                                                                toggleContent
                                                                    ? 'db-blue'
                                                                    : 'db-white'
                                                            }
                                                            style={{
                                                                borderTopRightRadius:
                                                                    '8px',
                                                                borderBottomRightRadius:
                                                                    '8px',
                                                            }}
                                                            onClick={() =>
                                                                setToggleContent(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            Text
                                                        </Button>
                                                    </div>
                                                )}

                                                <Button
                                                    classname="td-right"
                                                    disabled={isNextDisabled}
                                                    onClick={handleNextStep}
                                                >
                                                    {showTimer
                                                        ? 'Wait...'
                                                        : 'Next'}
                                                </Button>

                                                {(!isPlaying && barcodeStep) ||
                                                    (performLabelScan && (
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                maxWidth:
                                                                    '85px',
                                                            }}
                                                        ></div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                    {(step?.is_barcode || performLabelScan) &&
                                        !barcodeUploaded &&
                                        !enterBarcode && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'space-between',
                                                    gap: 4,
                                                    padding: '16px',
                                                }}
                                            >
                                                <Button
                                                    classname="man-btn"
                                                    onClick={() =>
                                                        setEnterBarcode(true)
                                                    }
                                                >
                                                    <FiEdit /> Enter Manually
                                                </Button>
                                                <Button
                                                    classname="cap-btn"
                                                    onClick={() => {
                                                        setBarcodeValue('');
                                                        setEnterBarcode(true);
                                                        // barcodeCapture();
                                                        setShowBCModal?.(true);
                                                    }}
                                                >
                                                    <TbCapture /> Capture
                                                </Button>
                                            </div>
                                        )}

                                    {/* {performLabelScan && !barcodeUploaded && !enterBarcode && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        classname="man-btn"
                        onClick={() => setEnterBarcode(true)}
                      >
                        <FiEdit /> Enter Manually
                      </Button>
                      <Button classname="cap-btn" onClick={barcodeCapture}>
                        <TbCapture /> Capture
                      </Button>
                    </div>
                  )} */}
                                    {enterBarcode && (
                                        <div
                                            className="manually-input-row"
                                            style={{ padding: '8px 0' }}
                                        >
                                            <input
                                                className="bc-input"
                                                type="text"
                                                placeholder="Enter Barcode or N/A, if no barcode is present."
                                                onChange={barcodeInput}
                                                value={barcodeValue}
                                            />
                                            <Button
                                                classname="td-right"
                                                onClick={handleSaveBarcode}
                                                disabled={
                                                    barcodeValue === ''
                                                        ? true
                                                        : false
                                                }
                                                style={{ height: '100%' }}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flex: 1,
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                        }}
                                        key={index + 2}
                                    >
                                        {!toggleContent ? (
                                            <Image
                                                className="test-graphic"
                                                src={
                                                    trackImageCapture &&
                                                    step?.is_capture_image
                                                        ? trackImageCapture
                                                        : step.image_path
                                                }
                                                alt="Proof Test Image"
                                                layout="fill"
                                                objectFit="cover"
                                                priority
                                                unoptimized
                                                placeholder="blur"
                                                blurDataURL="image/png"
                                                style={{ borderRadius: '16px' }}
                                            />
                                        ) : (
                                            <div className="test-text">
                                                <article className="test-step">
                                                    <h5>{step.step}</h5>
                                                </article>
                                                <p className="t-text">
                                                    {step.directions}
                                                </p>
                                            </div>
                                        )}

                                        {showTimer && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    zIndex: 9999,
                                                }}
                                            >
                                                <Timer
                                                    time={time}
                                                    showTimer={showTimer}
                                                    handleEnd={handleTimerEnd}
                                                />
                                            </div>
                                        )}
                                        {/* {showBCModal &&
                      (isScanditDisabled ? (
                        <IScannner
                          show={showBCModal}
                          scanType={scanType}
                          barcodeUploaded={barcodeUploaded}
                          step={activeStep}
                          totalSteps={test.length}
                          recapture={reCaptureBarcode}
                          closeModal={closeBCModal}
                          // videoRef={videoRef}
                          cameraRef={cameraRef}
                          onBarcodeScan={setBarcodeValue}
                          barcodeValue2={barcodeValue}
                          setBarcodeValue2={setBarcodeValue}
                          captureImageFn={barcodeCapture}
                          capturedImage={capturedImage}
                        />
                      ) : (
                        // <Scanner
                        //   show={showBCModal}
                        //   scanType={scanType}
                        //   barcodeUploaded={barcodeUploaded}
                        //   recapture={false}
                        //   closeModal={closeBCModal}
                        //   onBarcodeScan={setBarcodeValue}
                        //   manualBtn={false}
                        //   revealScanDetailsInScanner={false}
                        //   barcode={barcodeValue}
                        //   setBarcode={setBarcodeValue}
                        //   captureImageFn={barcodeCapture}
                        //   capturedImage={capturedImage}
                        // />
                        
                      ))} */}
                                        {showBCModal && (
                                            <ZxingBarcodeScanner
                                                show={showBCModal}
                                                scanType={scanType}
                                                barcodeUploaded={
                                                    barcodeUploaded
                                                }
                                                recapture={false}
                                                closeModal={closeBCModal}
                                                barcode={barcodeValue}
                                                setBarcode={setBarcodeValue}
                                                captureImageFn={barcodeCapture}
                                                capturedImage={capturedImage}
                                                setEnterManual={setEnterBarcode}
                                                cameraRef={cameraRef}
                                                barcodeValidator={
                                                    barcodeValidator
                                                }
                                            />
                                        )}
                                        <div className="timer-container">
                                            {enterBarcode &&
                                                manualImageCaptureTimer > 0 && (
                                                    <IdTimer
                                                        timeLeft={
                                                            manualImageCaptureTimer
                                                        }
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};
export default MobileTestView;
