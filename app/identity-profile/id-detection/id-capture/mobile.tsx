import Webcam from 'react-webcam';
import { RefObject, useEffect, useState } from 'react';
import Image from 'next/image';
import {
    AgreementHeader,
    AgreementFooter,
    IdTimer,
    PipDocTypeSelect,
    PipLoader,
    PipStepLoader,
    Loader_,
    AppContainer,
    AppHeader,
    Loader,
    Button,
} from '@/components';
import { useIDDetection } from '@/hooks/useIDDetection';
import { authToken } from '@/redux/slices/auth';
import { useSelector } from 'react-redux';
import { BsInfoCircle } from 'react-icons/bs';
import { TbCapture } from 'react-icons/tb';

interface CameraIDCardDetectionProps {
    permissionsGranted: boolean;
    capturedImage: string | null;
    faceImage: string | null;
    timeLeft?: number;
    isLoading: boolean;
    isDocTypeVisible: boolean;
    isVisible: boolean;
    isLoaderVisible: boolean;
    handleDocClose: () => void;
    handleManualCapture: () => void;
    handleLoaderClose: () => void;
    recaptureImage: () => void;
    recaptureManualImage: () => void;
    captureFrame: () => void;
    cameraRef: RefObject<Webcam>;
    canvasRef: RefObject<HTMLCanvasElement>;
    webcamKey: number;
    socketConnected?: boolean;
    errorMsg?: string;
    showCountdown: boolean;
}

const CameraIDCardDetectionMobile = ({
    permissionsGranted,
    capturedImage,
    faceImage,
    timeLeft,
    isLoading,
    isDocTypeVisible,
    isVisible,
    isLoaderVisible,
    handleDocClose,
    handleLoaderClose,
    recaptureImage,
    recaptureManualImage,
    captureFrame,
    cameraRef,
    canvasRef,
    webcamKey,
    socketConnected,
    errorMsg,
    handleManualCapture,
    showCountdown,
}: CameraIDCardDetectionProps) => {
    const { participant_id } = useSelector(authToken);
    const [showManual, setShowManual] = useState<boolean>(false);
    const [manualEnabled, setManualEnabled] = useState<boolean>(false);
    const { faceImage: image } = useIDDetection(
        participant_id as string,
        cameraRef,
    );

    const handlCapture = () => {
        setManualEnabled(true);
        handleManualCapture();
    };

    return (
        <>
            <AppContainer
                header={<AppHeader title="Phot ID" hasMute={false} />}
                body={
                    <>
                        <div className="test-items-wrap-desktop_">
                            <div className="sub-item">
                                <br />
                                <br />
                                {!capturedImage && (
                                    <p className="vid-text">
                                        Provide a picture of a valid Photo ID{' '}
                                        <br />
                                        Press `Capture` to take the photo.
                                    </p>
                                )}
                            </div>

                            {permissionsGranted ? (
                                !capturedImage ? (
                                    <div className="camera-container">
                                        <Webcam
                                            key={webcamKey}
                                            className="camera"
                                            ref={cameraRef}
                                            audio={false}
                                            screenshotFormat="image/png"
                                            imageSmoothing={true}
                                        />

                                        <div
                                            // className="id-card-frame-guide"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                zIndex: 999,
                                                position: 'absolute',
                                                padding: '8px',
                                            }}
                                        >
                                            <div className="box">
                                                <div className="content"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {capturedImage && (
                                            <div className="id-image">
                                                <Image
                                                    className="img-border"
                                                    src={capturedImage}
                                                    alt="Captured Image"
                                                    layout="responsive"
                                                    width={500}
                                                    height={500}
                                                />
                                            </div>
                                        )}
                                    </>
                                )
                            ) : (
                                <>
                                    <p className="vid-text">
                                        Camera access is not granted. Please
                                        allow camera access to continue.
                                    </p>
                                    <Loader_ />
                                </>
                            )}
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </>
                }
                footer={
                    <AgreementFooter
                        onPagination={false}
                        onLeftButton={!!capturedImage}
                        onRightButton={true}
                        btnLeftText={'Recapture'}
                        onClickBtnLeftAction={() => {
                            recaptureImage();
                            recaptureManualImage();
                        }}
                        btnRightText={
                            capturedImage
                                ? 'Next'
                                : showCountdown && timeLeft! > 0
                                ? `${timeLeft}`
                                : 'Capture'
                        }
                        onClickBtnRightAction={
                            capturedImage ? undefined : handlCapture
                        }
                        btnRightLink={
                            capturedImage
                                ? '/test-collection/scan-package-barcode'
                                : undefined
                        }
                    />
                }
            />
        </>
    );
};

export default CameraIDCardDetectionMobile;
