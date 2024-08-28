"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import useResponsive from "@/hooks/useResponsive";
import { AgreementFooter, AgreementHeader, DesktopFooter, Scanner } from '@/components';
import { setIDBack } from '@/redux/slices/appConfig';
import { uploadFileToS3 } from '../step-1/action';
import { scanIDAI } from '@/utils/queries';
import { toast } from 'react-toastify';


const CameraIDCardDetection = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showBCModal, setShowBCModal] = useState<boolean>(false);
    const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [brightness, setBrightness] = useState<number>(0);
    const [sigCanvasH, setSigCanvasH] = useState(0);
    const isDesktop = useResponsive();

    const cameraRef = useRef<Webcam | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    const captureFrame = useCallback(async () => {
        const imageSrc = cameraRef?.current!.getScreenshot();
        setCapturedImage(imageSrc);
        dispatch(setIDBack(imageSrc!));
        uploadFileToS3(imageSrc!, '8554443303-ID-BackCapture-1712042780.png').catch((error) => {
            console.error('ID Back Upload Error:', error)
        });

        const scanData = await scanIDAI(imageSrc!);
        console.log('scan id res:', scanData)

        if (scanData.status === 'complete') {
            console.log('success', scanData);
        }

        if (scanData.status === 'error') {
            toast.error(`${scanData.message}`);
        }

    }, [cameraRef, dispatch]);

    const recapture = () => {
        setCapturedImage('')
    }

    const calculateBrightness = useCallback((imageData: { data: any; }) => {
        const data = imageData.data;
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
        }

        const averageBrightness = totalBrightness / (data.length / 4);
        setBrightness(averageBrightness);
    }, []);

    const closeBCModal = () => {
        setShowBCModal(false);
        setBarcodeUploaded(false);
        router.push('/identity-profile/id-detection/scan-result');
    };

    const barcodeCapture = useCallback(async () => {
        try {
            setBarcodeUploaded(true);
            setShowBCModal(true);
        } catch (error) {
            toast.error('Error detecting barcode. Please try again.');
            console.error('Barcode Capture Error:', error);
        }
    }, []);



    useEffect(() => {
        const routeBasedOnScreenSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 700) {
                setSigCanvasH(250);
            } else {
                setSigCanvasH(700);
            }
        };
        routeBasedOnScreenSize();
        window.addEventListener('resize', routeBasedOnScreenSize);
        return () => window.removeEventListener('resize', routeBasedOnScreenSize);
    }, []);

    // useEffect(() => {
    //     calculateBrightness(cameraRef as any)
    // }, [calculateBrightness]);

    return (
        <>
            {!isDesktop ?
                <div className="id-detection-container" style={{ position: 'relative' }}>
                    <>
                        <AgreementHeader title="PIP - Step 2 " />
                        <br />
                        <div className='test-items-wrap-desktop_'>

                            {showBCModal && <div style={{ position: 'absolute', left: '0', width: '100%', height: '100%', zIndex: '1000' }}>
                                <Scanner show={showBCModal} scanType='id' barcodeUploaded={barcodeUploaded} step={2} totalSteps={3} recapture={() => setShowBCModal(false)} closeModal={closeBCModal} />
                            </div>}
                            {!capturedImage &&
                                <div className="sub-item">
                                    <p className="vid-text">
                                        Please position the rear side of your ID <br />
                                        in the camera frame below.
                                    </p>
                                </div>}
                            <br />
                            {/* <div className="vid-items-wrap"> */}
                            {!capturedImage ?
                                <div className='camera-container'>
                                    <Webcam
                                        className='camera'
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        imageSmoothing={true} />

                                    <div className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"}`}>
                                        {/* {brightness < 120 && (
                                        <div className='brightness-detection'>
                                            <p>Insufficient light detected.</p>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                                :
                                // <div className='id-image'>
                                !showBCModal && <Image className='id-image-2' src={capturedImage!} alt="captured Image" width={5000} height={5000} loading='lazy' />
                                // </div>
                            }
                        </div>
                    </>
                    {capturedImage && !showBCModal &&
                        <p className="vid-text m-5">
                            Please tap the `Next` button to see the result of your scanning.
                        </p>
                    }

                    {/* </div> */}
                    {capturedImage ?
                        <AgreementFooter
                            onPagination={false}
                            onLeftButton={true}
                            onRightButton={true}
                            // btnRightLink={'/identity-profile/id-detection/scan-result'}
                            // btnRightText={"Next"}
                            btnRightText={"Scan ID"}
                            btnLeftText={capturedImage ? 'Recapture' : ""}
                            onClickBtnLeftAction={capturedImage ? recapture : () => { }}
                            onClickBtnRightAction={barcodeCapture}
                        />
                        :
                        <AgreementFooter
                            onPagination={false}
                            onLeftButton={false}
                            onRightButton={true}
                            btnRightText={"Capture"}
                            onClickBtnRightAction={captureFrame}
                        />
                    }
                </div > :
                <div className="id-detection-container_" style={{ position: 'relative' }}>
                    <>
                        <AgreementHeader title="PROOF Identity Profile (PIP)" />
                        <div className='camera-items-wrap-desktop_'>

                            {showBCModal && <div style={{ position: 'absolute', left: '0', top: "0", width: '100%', height: '100%', zIndex: '1000' }}>
                                <Scanner show={showBCModal} scanType='id' barcodeUploaded={barcodeUploaded} step={2} totalSteps={3} recapture={() => setShowBCModal(false)} closeModal={closeBCModal} />
                            </div>}

                            <div className="sub-item">
                                <h3 className="">PIP - Step 2</h3>
                                <br />
                                {!capturedImage && <p className="">Please position the rear side of your ID in the camera frame below.</p>}
                                {!showBCModal && <p className=""> Please tap the `Next` button to move to the next step </p>}

                            </div>

                            {/* <div className="vid-items-wrap"> */}
                            {!capturedImage ?
                                <div className='camera-container'>
                                    <Webcam
                                        className='camera'
                                        ref={cameraRef}
                                        audio={false}
                                        screenshotFormat="image/png"
                                        imageSmoothing={true} />

                                    <div className={`id-card-frame-guide ${faceDetected ? "face-detected" : "no-face-detected"}`}>
                                        {/* {brightness < 120 && (
                                        <div className='brightness-detection'>
                                            <p>Insufficient light detected.</p>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                                :
                                <div className="id-img_">
                                    <div className='id-image'>
                                        !showBCModal && <Image className='img-border' src={capturedImage!} alt="captured Image" width={5000} height={5000} loading='lazy' layout="responsive" />
                                    </div>
                                </div>

                            }
                        </div>
                    </>
                    {capturedImage && !showBCModal &&
                        <p className="vid-text m-5">
                            Please tap the `Next` button to see the result of your scanning.
                        </p>
                    }

                    {capturedImage ?
                        <DesktopFooter
                            onPagination={false}
                            onLeftButton={true}
                            onRightButton={true}
                            // btnRightLink={'/identity-profile/id-detection/scan-result'}
                            // btnRightText={"Next"}
                            btnRightText={"Scan ID"}
                            btnLeftText={capturedImage ? 'Recapture' : ""}
                            onClickBtnLeftAction={capturedImage ? recapture : () => { }}
                            onClickBtnRightAction={barcodeCapture}
                        />
                        :
                        <DesktopFooter
                            onPagination={false}
                            onLeftButton={false}
                            onRightButton={true}
                            btnRightText={"Capture"}
                            onClickBtnRightAction={captureFrame}
                        />
                    }
                </div >
            }
        </>
    );
};

export default CameraIDCardDetection;
