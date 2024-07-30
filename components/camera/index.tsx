"use client";

import Webcam from 'react-webcam';
import { useState, useRef, useCallback, useEffect } from 'react';
import { TbCapture } from "react-icons/tb";
import { MdOutlineFlipCameraIos } from "react-icons/md";

import './camera.css'
import { toast } from 'react-toastify';
import Button from '../button';
import Loader from '../loaders/pageLoader';

interface CameraProps {
    show: boolean;
    captureFrame(): void;
}


const Camera = ({ show, captureFrame }: CameraProps) => {
    const cameraRef = useRef<Webcam | null>(null);
    const [cameraMode, setCameraMode] = useState<string>('user');
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [showFlipBtn, setShowFlipBtn] = useState<boolean>(false);

    const initCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices.length > 0) {
                setPermissionsGranted(true);
            }

            if (videoDevices.length > 1) {
                setShowFlipBtn(true)
            }

        } catch (error) {
            toast.error('Error accessing camera. Please allow camera access to continue.');
            console.error('Error accessing camera:', error);
        }
    }, []);

    const flipCamera = useCallback(async () => {
        try {
            if (cameraMode === 'user') {
                setCameraMode('environment');
            }

            if (cameraMode === 'environment') {
                setCameraMode('user');
            }
        } catch (error) {
            console.error('Error accessing camera on switch:', error);
        }
    }, [cameraMode]);

    useEffect(() => {
        initCamera();
    }, [initCamera])

    return show && (
        permissionsGranted ?
            <div className='web-cam' >
                < Webcam
                    className='web-camera'
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/png"
                    videoConstraints={{
                        facingMode: cameraMode,
                    }}
                    imageSmoothing={true}
                />
                <div className='barcode-btns' style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {showFlipBtn && <Button classname='man-btn' onClick={flipCamera}><MdOutlineFlipCameraIos /> flip cam</Button>}
                    <Button classname='cap-btn' onClick={captureFrame}><TbCapture /> capture</Button>
                </div>
            </div > :
            <Loader />
    )
}

export default Camera;