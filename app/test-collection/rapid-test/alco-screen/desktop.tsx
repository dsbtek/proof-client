'use client';

import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import { CSSProperties } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    AgreementFooter,
    AlcoResultModal,
    AppContainer,
    AppHeader,
    DesktopFooter,
    Loader_,
    Timer,
} from '@/components';
import { testingKit } from '@/redux/slices/drugTest';
import useResponsive from '@/hooks/useResponsive';
import useAlcoOralDetector from '@/hooks/useAlcoOraltox';
import useAlcoholDetection from '@/hooks/useAlcoholDetection';

interface IAlcoholDetection {
    permissionsGranted?: boolean;
    cameraRef: RefObject<Webcam>;
    canvasRef: RefObject<HTMLCanvasElement>;
    webcamKey?: number;
    errorMsg?: string;
}

const Desktop = ({ canvasRef, cameraRef }: IAlcoholDetection) => {
    return (
        <div className="id-detection-container_">
            <div className="test-items-wrap-desktop_">
                <div className="sub-item">
                    <div className="alco-text">
                        <h3 className=""> Position your test device</h3>
                        <br />
                        <p className="with-bullet">
                            Place the test device within the clear silhouette to
                            ensure proper alignment and optimal results.
                        </p>
                    </div>
                </div>
                <div className="camera-container">
                    <Webcam
                        className="alco-camera"
                        ref={cameraRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={{
                            facingMode: 'user',
                        }}
                        imageSmoothing={true}
                        mirrored
                    />
                    <div className="frameStyle">
                        <div className="wrap-alco-silhoutte">
                            <div className="alco-silhoutte"></div>
                            <div className="alco-silhoutte_"></div>
                            <canvas className="alco-canvas" ref={canvasRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Desktop;
