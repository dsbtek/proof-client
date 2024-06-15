'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { DocumentTypeModal, Button, ThumbnailGallery, AppHeader } from '@/components';
import { setScanReport, selectScanReports } from '@/redux/slices/appConfig';

const ScanLabReport = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [imageName, setImageName] = useState<string>('');
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const scanReports = useSelector(selectScanReports);

    const initCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);

            if (videoDevices.length === 1) {
                setSelectedCamera(videoDevices[0].deviceId);
            }

            if (videoDevices.length > 0) {
                setPermissionsGranted(true);
            }
        } catch (error) {
            toast.error('Error accessing camera. Please allow camera access to continue.');
            console.error('Error accessing camera:', error);
        }
    }, []);

    const captureFrame = useCallback(() => {
        try {
            const imageSrc = cameraRef.current?.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);
                dispatch(setScanReport({ [imageName]: imageSrc }));
                setShowCamera(false);
            }
        } catch (error) {
            toast.error('Error capturing image. Please try again.');
            console.error(error);
        }
    }, [cameraRef, dispatch, imageName]);

    useEffect(() => {
        if (showCamera) {
            initCamera();
        }
    }, [showCamera, initCamera]);

    return (
        <div className="container" style={{ position: 'relative', height: '100vh' }}>
            <AppHeader title="PROOFpass Upload" />

            {showModal && (
                <DocumentTypeModal
                    onClose={() => {
                        setShowModal(false);
                        // setShowCamera(true);
                    }}
                    setImageName={setImageName}
                    triggerCamera={() => {
                        setShowModal(false);
                        setShowCamera(true);
                    }}
                />
            )}

            <div className="proof-pass-camera-wrapper">
                {permissionsGranted && showCamera && (
                    <>
                        {cameras.length > 1 && (
                            <select onChange={(e) => setSelectedCamera(e.target.value)} value={selectedCamera}>
                                <option value="">Select a camera</option>
                                {cameras.map((camera) => (
                                    <option key={camera.deviceId} value={camera.deviceId}>
                                        {camera.label || `Camera ${camera.deviceId}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        {selectedCamera && (
                            <Webcam
                                className='proof-pass-camera-container'
                                ref={cameraRef}
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={{ deviceId: selectedCamera }}
                                imageSmoothing={true}
                            />
                        )}
                    </>
                )}
                {showCamera && (
                    <Button blue disabled={false} type="submit" onClick={captureFrame} style={{ position: 'absolute', bottom: '2rem', width: '90%' }}>
                        Capture
                    </Button>
                )}
                {scanReports.length > 0 || showCamera ? '' : <p style={{ position: 'absolute', bottom: '50%', top: '50%', textAlign: 'center', padding: '16px' }}>Press the Add button with + to take a photo of your test result.</p>}

                {!showCamera &&
                    < ThumbnailGallery images={scanReports} />
                }
            </div>

            {!showCamera &&
                <div className='proof-pass-button-container'>
                    <Button white classname="prompt-yes-btn m-5 w-scan-btn" style={{ width: '150px' }} onClick={() => {
                        setShowModal(true);
                        setShowCamera(false);
                    }}>
                        + Add
                    </Button>
                    <Button blue classname="prompt-yes-btn m-5 w-scan-btn" style={{ width: '150px' }} link='scan-report'>
                        Submit
                    </Button>
                </div>
            }

        </div>

    );
};
export default ScanLabReport;
