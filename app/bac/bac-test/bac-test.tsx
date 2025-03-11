'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    AppContainer,
    AppHeader,
    BacProgressBar,
    DesktopFooter,
    Loader_,
} from '@/components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useFaceDetector from '@/hooks/faceDetector';
import { FiInfo } from 'react-icons/fi';
import useGetDeviceInfo from '@/hooks/useGetDeviceInfo';

const BacTest = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] =
        useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const [imageName, setImageName] = useState<string>('');
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { faceDetected } = useFaceDetector(cameraRef);
    const router = useRouter();
    let [progress, setProgress] = useState<number>(0);
    const [result, setResult] = useState<boolean>(false);
    const device = useGetDeviceInfo();

    const initCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === 'videoinput',
            );
            if (videoDevices.length > 0) {
                setPermissionsGranted(true);
            }
        } catch (error) {
            toast.error(
                'Error accessing camera. Please allow camera access to continue.',
            );
            console.error('Error accessing camera:', error);
        }
    }, []);

    const handleBlowAir = () => {
        if (progress < 100) setProgress(progress + 10);
    };

    useEffect(() => {
        if (showCamera) {
            initCamera();
        }
    }, [showCamera, initCamera]);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {}, 3000);
            setResult(true);
        }
    }, [progress]);

    const frameStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
    };

    return (
        <AppContainer
            header={<AppHeader title={'BAC TEST'} hasMute={false} />}
            body={
                <div className="container-bac-screen">
                    {/* <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            paddingRight: '16px',
                        }}
                    > */}
                    {device?.screenWidth < 700 ? (
                        <div className="bac-camera-wrapper">
                            {permissionsGranted && showCamera && (
                                <>
                                    <Webcam
                                        className="bac-camera-container"
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        imageSmoothing={true}
                                    />
                                    <div style={frameStyle}>
                                        {faceDetected ? (
                                            <Image
                                                className="detection-image"
                                                src="/images/face-detected-green.png"
                                                alt="Face Detected"
                                                width={2000}
                                                height={2000}
                                                layout="contain"
                                            />
                                        ) : (
                                            <Image
                                                className="detection-image"
                                                src="/images/face-no-detected-red.png"
                                                alt="Face Not Detected"
                                                width={2000}
                                                height={2000}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                            <BacProgressBar
                                progress={progress}
                                onClick={handleBlowAir}
                                result={result}
                            />

                            {isLoading && <Loader_ />}
                        </div>
                    ) : (
                        <div
                            className="test-items-wrap-desktop_"
                            style={{ paddingRight: '0px' }}
                        >
                            {!capturedImage && (
                                <div className="sub-item">
                                    <h4 className="">
                                        {result
                                            ? 'BAC Result Available'
                                            : 'Breathe into the Device Until Fully Powered'}
                                    </h4>
                                    <br />
                                    {result ? (
                                        <ul
                                            style={{
                                                maxWidth: '464px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                paddingLeft: '16px',
                                            }}
                                        >
                                            <li>
                                                Your Blood Alcohol Concentration
                                                (BAC) result is now available.
                                            </li>
                                            <li>
                                                Your BAC is 0.00255, which is
                                                Positive.
                                            </li>
                                            <li>
                                                Please review the result to
                                                understand your current alcohol
                                                level and take any necessary
                                                actions.
                                            </li>
                                        </ul>
                                    ) : (
                                        <p className="">
                                            Please breathe into the device
                                            steadily until the indicator below
                                            shows full power. This ensures
                                            accurate measurement and optimal
                                            performance.
                                        </p>
                                    )}
                                    <BacProgressBar
                                        progress={progress}
                                        onClick={handleBlowAir}
                                        result={result}
                                    />
                                </div>
                            )}

                            <div className="camera-container">
                                <Webcam
                                    className="camera"
                                    ref={cameraRef}
                                    audio={false}
                                    screenshotFormat="image/png"
                                    videoConstraints={{
                                        facingMode: 'user',
                                    }}
                                    imageSmoothing={true}
                                />
                                <div style={frameStyle as any}>
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
                                </div>
                            </div>
                        </div>
                    )}
                    {/* </div> */}
                </div>
            }
            footer={
                <DesktopFooter
                    //   currentNumber={1}
                    //   outOf={4}
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    //   btnLeftLink={""}
                    // btnRightLink={pathLink()}
                    //   btnLeftText={capturedImage ? "Recapture" : ""}
                    btnRightText={'Next'}
                />
            }
        />
    );
};

export default BacTest;
