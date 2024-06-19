"use client";

import { useState, useRef, useCallback } from 'react';
import Image from "next/image";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";

import { AgreementFooter, AgreementHeader } from '@/components';
import { setIDBack } from '@/redux/slices/appConfig';


const CameraIDCardDetection = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();

    const captureFrame = useCallback(() => {
        const imageSrc = cameraRef?.current!.getScreenshot();
        setCapturedImage(imageSrc);
        dispatch(setIDBack(imageSrc!));
    }, [cameraRef, dispatch]);

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
                    <div className='vid-frame'></div>
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
                    onLeftButton={false}
                    onRightButton={true}
                    btnRightLink={'/identity-profile/id-detection/scan-result'}
                    btnRightText={"Next"}
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
