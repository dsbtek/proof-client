"use client";


import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

interface CameraViewProps {
    onCapture: (screenshot: string | null) => void;
    onFaceDetected: (faceDetected: boolean) => void;
    faceMesh: any;
    selectedCameraId: string | null;
    setSelectedCameraId: (id: string) => void;
    cameras: MediaDeviceInfo[];
    permissionsGranted: boolean;
}

const CameraView = ({
    onCapture,
    onFaceDetected,
    faceMesh,
    selectedCameraId,
    setSelectedCameraId,
    cameras,
    permissionsGranted
}: CameraViewProps) => {
    const cameraRef = useRef<Webcam | null>(null);

    useEffect(() => {
        const checkForFace = async () => {
            if (cameraRef.current && faceMesh) {
                const screenshot = cameraRef.current.getScreenshot();
                if (screenshot) {
                    const img = new window.Image();
                    img.src = screenshot;
                    img.onload = async () => {
                        const predictions = await faceMesh.predict(img);
                        onFaceDetected(predictions.length > 0);
                    };
                }
            }
        };

        const interval = setInterval(checkForFace, 1000);
        return () => clearInterval(interval);
    }, [faceMesh, onFaceDetected]);

    return (
        <div style={{ position: 'relative' }}>
            {/* <label htmlFor="camera-select" className="camera-select-label">Select Camera:</label> */}
            <select
                id="camera-select"
                value={selectedCameraId || ''}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="camera-select"
            >
                {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${camera.deviceId}`}
                    </option>
                ))}
            </select>

            <Webcam
                className='camera'
                ref={cameraRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={{ deviceId: selectedCameraId as ConstrainDOMString | undefined }}
                imageSmoothing={true}
            />
        </div>
    );
};

export default CameraView;
