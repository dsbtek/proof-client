'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { AgreementHeader, BacProgressBar, Loader_ } from '@/components';
import { useRouter } from 'next/navigation';
import { setScanReport } from "@/redux/slices/appConfig";
import Image from 'next/image';
import useFaceDetector from '@/hooks/faceDetector';

const BacTest = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const [imageName, setImageName] = useState<string>('');
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { faceDetected } = useFaceDetector(cameraRef);
    const router = useRouter();
    let [progress, setProgress] = useState<number>(0);

    const initCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 0) {
                setPermissionsGranted(true);
            }
        } catch (error) {
            toast.error('Error accessing camera. Please allow camera access to continue.');
            console.error('Error accessing camera:', error);
        }
    }, []);

    const handleBlowAir = () => {
        setProgress(progress + 10);
    }

    useEffect(() => {
        if (showCamera) {
            initCamera();
        }
    }, [showCamera, initCamera]);

    const frameStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
    };

    return (
        <div className="container">
            <AgreementHeader title="BAC TEST" />
            <div className="proof-pass-camera-wrapper">
                {permissionsGranted && showCamera && (
                    <>
                        <Webcam
                            className='bac-camera-container'
                            ref={cameraRef}
                            audio={false}
                            screenshotFormat="image/png"
                            imageSmoothing={true}
                        />
                        <div style={frameStyle}>
                            {faceDetected ? (
                                <Image className="detection-image" src="/images/face-detected.png" alt="Face Detected" width={2000} height={2000} />
                            ) : (
                                <Image className="detection-image" src="/images/face-no-detected.png" alt="Face Not Detected" width={2000} height={2000} />
                            )}
                        </div>
                    </>
                )}
                <BacProgressBar progress={progress} onClick={handleBlowAir} />

                {isLoading && <Loader_ />}
            </div>
        </div>
    );
};

export default BacTest;
