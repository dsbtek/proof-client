import Webcam from "react-webcam";
import { RefObject } from "react";
import Image from "next/image";
import { AgreementHeader, AgreementFooter, IdTimer, PipDocTypeSelect, PipLoader, PipStepLoader, Loader_ } from "@/components";

interface CameraIDCardDetectionProps {
    permissionsGranted: boolean;
    capturedImage: string | null;
    faceImage: string | null;
    timeLeft: number;
    isLoading: boolean;
    isDocTypeVisible: boolean;
    isVisible: boolean;
    isLoaderVisible: boolean;
    handleDocClose: () => void;
    handleLoaderClose: () => void;
    recaptureImage: () => void;
    captureFrame: () => void;
    cameraRef: RefObject<Webcam>;
    canvasRef: RefObject<HTMLCanvasElement>;
    webcamKey: number;
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
    captureFrame,
    cameraRef,
    canvasRef,
    webcamKey,
}: CameraIDCardDetectionProps) => {
    return (
        <div className="id-detection-container" style={{ position: "relative" }}>
            <PipDocTypeSelect
                pipStep={1}
                isVisible={isDocTypeVisible}
                onClose={handleDocClose}
            />
            <PipLoader pipStep={1} isVisible={isVisible} />
            <PipStepLoader
                pipStep={1}
                isVisible={isLoaderVisible}
                onClose={handleLoaderClose}
            />

            <AgreementHeader title="PIP - Step 1" />

            <div className="test-items-wrap-desktop_">
                <div className="sub-item">
                    {!capturedImage && (
                        <p className="vid-text">
                            Please position the front side of your ID <br />
                            in the camera frame below.
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
                                mirrored
                            />
                            <div className={`id-card-frame-guide ${"face-detected"}`}>
                                {isLoading && timeLeft >= 0 && <IdTimer timeLeft={timeLeft} />}
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
                            {faceImage && (
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
                            )}
                        </>
                    )
                ) : (
                    <>
                        <p className="vid-text">
                            Camera access is not granted. Please allow camera access to
                            continue.
                        </p>
                        <Loader_ />
                    </>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <AgreementFooter
                onPagination={false}
                onLeftButton={!!capturedImage}
                onRightButton={true}
                btnLeftText={"Recapture"}
                onClickBtnLeftAction={recaptureImage}
                btnRightText={"Next"}
                onClickBtnRightAction={capturedImage ? undefined : captureFrame}
                rightdisabled={!faceImage}
                btnRightLink={
                    capturedImage ? "/identity-profile/id-detection/step-2" : undefined
                }
            />
        </div>
    );
};

export default CameraIDCardDetectionMobile;
