import Webcam from "react-webcam";
import { RefObject } from "react";
import Image from "next/image";
import { AgreementHeader, IdTimer, PipDocTypeSelect, PipLoader, PipStepLoader, Loader_, DesktopFooter } from "@/components";

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
    captureFrame,
    cameraRef,
    canvasRef,
    webcamKey,

}: CameraIDCardDetectionProps) => {
    return (
        <div className="id-detection-container_" style={{ position: "relative" }}>
            <PipDocTypeSelect
                pipStep={1}
                isVisible={isDocTypeVisible}
                onClose={handleDocClose}
            />
            <PipLoader pipStep={1} isVisible={isVisible} />
            <AgreementHeader title="PROOF Identity Profile (PIP)" />

            <div className="camera-items-wrap-desktop_">
                <div className="sub-item">
                    <h3>PIP - 1</h3>
                    <br />
                    {!capturedImage && (
                        <p>
                            Please position the front side of your ID <br />
                            in the camera frame below.
                        </p>
                    )}
                    {faceImage && (
                        <p>
                            Please tap the `Next` button to move to step 3 <br />
                            where you will position the rear side of your ID.
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
                            <div className="id-img_" style={{ display: "flex", flexDirection: "column" }}>
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
                                        <p className="vid-text" style={{ color: "#009cf9", marginBottom: "8px", whiteSpace: "nowrap" }}>
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
                            </div>
                        </>
                    )
                ) : (
                    <>
                        <p className="vid-text">
                            Camera access is not granted. Please allow camera access to continue.
                        </p>
                        <Loader_ />
                    </>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <DesktopFooter
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

export default CameraIDCardDetectionDesktop;
