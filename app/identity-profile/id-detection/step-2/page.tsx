"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import useResponsive from "@/hooks/useResponsive";
import { AgreementFooter, AgreementHeader, DesktopFooter, Scanner } from '@/components';

const CameraIDCardDetection = () => {
    const isDesktop = useResponsive();

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showBCModal, setShowBCModal] = useState<boolean>(false);
    const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(false);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [brightness, setBrightness] = useState<number>(0);
    const [sigCanvasH, setSigCanvasH] = useState(0);

    const cameraRef = useRef<Webcam | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    const closeBCModal = () => {
        setShowBCModal(false);
        setBarcodeUploaded(false);
        router.push('/identity-profile/sample-facial-capture');
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

    return (
        <>
            {!isDesktop ?
                <div className="id-detection-container" style={{ position: 'relative' }}>
                    <>
                        <AgreementHeader title="PIP - Step 2 " />
                        {!showBCModal && <br />}
                        {showBCModal && <div style={{ position: 'absolute', left: '0', width: '100%', height: '100%', zIndex: '1000' }}>
                            <Scanner show={showBCModal} scanType='id' barcodeUploaded={barcodeUploaded} step={2} totalSteps={3} recapture={() => setShowBCModal(false)} closeModal={closeBCModal} />
                        </div>}
                        {!showBCModal &&
                            <>
                                <p className="vid-text">
                                    Please position the rear side of your ID <br />
                                </p>
                                <Image className='id-image-2' src='/images/proof-identity-profile.svg' alt="captured Image" width={5000} height={5000} loading='lazy' />
                                <br />
                                <p className="vid-text m-5">
                                    Please tap the `Scan ID` button to begin scanning your ID card.
                                </p>
                            </>
                        }
                        <br />
                    </>

                    {!showBCModal ?
                        <AgreementFooter
                            onPagination={false}
                            onLeftButton={false}
                            onRightButton={true}
                            btnRightText={"Scan ID"}
                            onClickBtnRightAction={barcodeCapture}
                        />
                        :
                        <AgreementFooter
                            onPagination={false}
                            onLeftButton={false}
                            onRightButton={true}
                            btnRightText={"Next"}
                            onClickBtnRightAction={closeBCModal}
                        />
                    }
                </div > :
                <div className="id-detection-container_" style={{ position: 'relative' }}>
                    <>
                        <AgreementHeader title="PROOF Identity Profile (PIP)" />
                        <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                            <div className='camera-wrap-desktop'>
                                <div className="sub-item-2">
                                    <h3 className="">PIP - Step 2</h3>
                                    <br />
                                    <p className="m-5">
                                        Please position the rear side of your ID <br />
                                    </p>
                                    <br />
                                    <Image className='id-image-2' src='/images/proof-identity-profile.svg' alt="captured Image" width={5000} height={5000} loading='lazy' />
                                    <br />
                                    <p className="vid-text m-5">
                                        Please ensure the barcode is withiin the guide frame.
                                    </p>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: '0', top: "0", width: '50%', height: '100%', zIndex: '1000' }}>
                                <Scanner show={true} scanType='id' barcodeUploaded={true} step={2} totalSteps={3} recapture={() => setShowBCModal(false)} closeModal={closeBCModal} />
                            </div>
                        </div>
                    </>
                    {/* <DesktopFooter
                        onPagination={false}
                        onLeftButton={false}
                        onRightButton={true}
                        btnRightText={"Next"}
                        onClickBtnRightAction={closeBCModal}
                    /> */}
                </div >
            }
        </>
    );
};

export default CameraIDCardDetection;
