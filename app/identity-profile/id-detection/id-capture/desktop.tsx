import Webcam from 'react-webcam';
import { RefObject, useEffect, useState } from 'react';
import Image from 'next/image';
import {
    AgreementHeader,
    IdTimer,
    PipDocTypeSelect,
    PipLoader,
    PipStepLoader,
    Loader_,
    DesktopFooter,
    AppContainer,
    AppHeader,
    Loader,
    Button,
    GenerateQRCode,
} from '@/components';
import '../../../../components/modals/modal.css';
import { useSelector } from 'react-redux';
import { authToken } from '@/redux/slices/auth';
import { useIDDetection } from '@/hooks/useIDDetection';
import { BsInfoCircle } from 'react-icons/bs';
import { TbCapture } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { testingKit } from '@/redux/slices/drugTest';
import { pageRedirect } from '@/redux/slices/appConfig';
import { toast } from 'react-toastify';

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

const CameraIDCardDetectionDesktop = ({
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
    showCountdown,
    handleManualCapture,
}: CameraIDCardDetectionProps) => {
    const { participant_id } = useSelector(authToken);
    const [showManual, setShowManual] = useState<boolean>(false);
    const [manualEnabled, setManualEnabled] = useState<boolean>(false);
    const [generateQr, setGenerateQr] = useState<boolean>(false);
    const router = useRouter();
    const { Scan_Kit_Label } = useSelector(testingKit);
    const preTestQuestionnaire = useSelector(
        (state: any) => state.preTest.preTestQuestionnaire,
    );
    const pageDestination = useSelector(pageRedirect);
    const handlCapture = () => {
        setManualEnabled(true);
        handleManualCapture();
    };

    const pathLink = (): string => {
        let destination = pageDestination?.page;
        try {
            if (destination === '/bac') {
                return '/bac';
            } else if (destination === '/proof-pass/proof-pass-upload') {
                return '/proof-pass/proof-pass-upload';
            } else if (Scan_Kit_Label) {
                return '/test-collection/scan-package-barcode';
            } else if (
                preTestQuestionnaire &&
                preTestQuestionnaire?.length > 0
            ) {
                return '/pre-test-questions';
            } else return `/test-collection/clear-view`;
        } catch (error) {
            toast.error(`Error: ${error}`);
            return `Error: ${error}`;
        }
    };

    return (
        <>
            <AppContainer
                header={<AppHeader title="Phot ID" hasMute={false} />}
                body={
                    <>
                        <div className="camera-items-wrap-desktop_">
                            <div className="sub-item">
                                <div style={{ minHeight: '10px' }}>
                                    <h3>
                                        Provide a picture of a valid Photo ID{' '}
                                    </h3>
                                    <br />
                                    {!capturedImage && (
                                        <p className="with-bullet">
                                            Press `Capture` to take the photo.
                                        </p>
                                    )}
                                </div>
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
                                            mirrored
                                            style={{
                                                height: 'auto',
                                                objectFit: 'contain',
                                                borderRadius: '16px',
                                            }}
                                        />
                                        <div className={`id-card-frame-guide`}>
                                            {/* {!socketConnected && <Loader_ />} */}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="id-img_"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
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
                                            {/* {faceImage && (
                        <div className="face-image-wrap">
                          <p
                            className="vid-text"
                            style={{
                              color: "#009cf9",
                              marginBottom: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Extracted ID Face
                          </p>
                          <Image
                            className="face-image"
                            src={faceImage}
                            alt="Extracted Face Image"
                            layout="responsive"
                            width={200}
                            height={200}
                          />
                        </div>
                      )} */}
                                        </div>
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
                    <DesktopFooter
                        onPagination={false}
                        onLeftButton={!!capturedImage}
                        onRightButton={true}
                        btnLeftText={'Recapture'}
                        onClickBtnLeftAction={() => {
                            setManualEnabled(false);
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
                        btnRightLink={capturedImage ? pathLink() : undefined}
                    />
                }
            />
        </>
    );
};

export default CameraIDCardDetectionDesktop;
