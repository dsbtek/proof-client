"use client";

import { useState, useRef, useCallback } from 'react';
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";

import { AgreementFooter, AgreementHeader } from '@/components';
import { setIDBack } from '@/redux/slices/appConfig';
import { uploadFileToS3 } from '../step-1/action';
import { scanIDAI } from '@/utils/queries';
import { toast } from 'react-toastify';


const CameraIDCardDetection = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();

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

    return (
        <div className="container" style={{ position: 'relative' }}>
            <AgreementHeader title="PIP - Step 2 " />
            <br />
            {!capturedImage &&
                <p className="vid-text">
                    Please position the rear side of your ID <br />
                    in the camera frame below.
                </p>
            }
            <br />
            {/* <div className="vid-items-wrap"> */}
            {!capturedImage ?
                <div className='camera-container'>
                    <Webcam
                        className='camera'
                        ref={cameraRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={{
                            facingMode: "user"
                        }}
                        imageSmoothing={true}
                    />
                    <div className='id-card-frame-guide vid-frame'></div>
                </div>
                :
                <Image className='id-image-2' src={capturedImage} alt="captured Image" width={5000} height={5000} loading='lazy' />
            }
            {capturedImage &&
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
                    btnRightLink={'/identity-profile/id-detection/scan-result'}
                    btnRightText={"Next"}
                    btnLeftText={capturedImage ? 'Recapture' : ""}
                    onClickBtnLeftAction={capturedImage ? recapture : () => { }}
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
        </div>
    );
};

export default CameraIDCardDetection;
