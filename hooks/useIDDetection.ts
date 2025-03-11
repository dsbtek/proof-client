'use client';

import { uploadImagesToS3 } from '@/app/identity-profile/id-detection/step-1/action';
import { setExtractedFaceImage, setIDFront } from '@/redux/slices/appConfig';
import {
    setGovernmentID,
    setIdDetails,
    setPassport,
    setProofID,
} from '@/redux/slices/drugTest';
import { extractIdAndFace } from '@/utils/queries';
import * as Sentry from '@sentry/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';
// import useSocketConnection from "./useSocket";

export const useIDDetection = (
    participant_id: string,
    cameraRef: React.RefObject<Webcam>,
) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [faceImage, setFaceImage] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(5);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [isDocTypeVisible, setDocTypeVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [preCaturedImage, setPreCapturedImage] = useState<string | null>(
        null,
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showCountdown, setShowCountdown] = useState<boolean>(false);
    const [idInformation, setIDInformation] = useState<
        | {
              first_name: string;
              last_name: string;
              date_of_birth: string;
              address: string;
              city: string;
              state: string;
              zipcode: string;
          }[]
    >([]);

    const dispatch = useDispatch();
    // const {
    //   isConnected,
    //   sendMessage,
    //   response,
    //   connecting,
    //   startRecording,
    //   stopRecording,
    // } = useSocketConnection(
    //   "wss://proof-api-7de87a4faca9.herokuapp.com/check-id-video",
    //   cameraRef
    // );

    // A ref to track if images have been set already (ensures first successful response)
    const isFirstResponse = useRef(true);

    // const face = useMemo(() => {
    //   let res = JSON.parse(response);

    //   if (Array?.isArray(res?.result) && res?.result?.length > 0 && !faceImage) {
    //     return res?.result!;
    //   }
    //   return null;
    // }, [response, faceImage]);

    const handleSetErrorMessage = (newMessage: string) => {
        // Set the message
        setErrorMsg(newMessage);

        // Clear the message after 10 seconds
        setTimeout(() => {
            setErrorMsg(
                'Please position DL properly for a good scan, ensure text and face are visible and not blurry',
            );
        }, 10000); // 10000 ms = 10 seconds
    };

    // useEffect(() => {
    //   if (!face && response) {
    //     let res = JSON.parse(response);
    //     if (res?.message) {
    //       if (
    //         res?.message === "0 faces found" &&
    //         errorMsg !== "ID information found but face couldn't extract"
    //       ) {
    //         handleSetErrorMessage(
    //           "ID information found but face couldn't extract"
    //         );
    //         toast.warning("ID information found but face couldn't extract");
    //       } else if (
    //         res?.message ===
    //           "No ID card information found.Ensure scan is not blurry and no visible glare" &&
    //         errorMsg !==
    //           "No ID card information found ensure scan is not blurry and no visible glare"
    //       ) {
    //         handleSetErrorMessage(
    //           "No ID card information found ensure scan is not blurry and no visible glare"
    //         );
    //         toast.warning(
    //           "No ID card information found ensure scan is not blurry and no visible glare"
    //         );
    //       }
    //     }
    //   }
    // }, [response, face]);

    const extractFace = useCallback(async (imgBase64: string) => {
        setIsVisible(true);
        const extractedFaces = await extractIdAndFace(imgBase64);
        if (extractedFaces.message === '0 faces found') {
            Sentry.captureMessage('An error occurred extracting face');
            toast.error('Face not detected, Re-try!');
            setIsVisible(false);
            setLoaderVisible(false);
            setCapturedImage(null);
            setTimeLeft(5);
            setDocTypeVisible(true);
            return false;
        }
        setIsVisible(false);
        setLoaderVisible(true);

        return {
            face: extractedFaces?.result,
            capturedImg: extractedFaces?.base64_image,
            data: extractedFaces?.data,
        };
    }, []);

    const captureFrame = useCallback(async () => {
        try {
            setShowCountdown(true);
            const imageSrc = cameraRef?.current?.getScreenshot();

            setPreCapturedImage(imageSrc as string);

            if (imageSrc && !faceImage) {
                // sendMessage(imageSrc!.replace(/^data:image\/\w+;base64,/, ""));

                extractFace(
                    imageSrc!.replace(/^data:image\/\w+;base64,/, ''),
                ).then((result: any) => {
                    const face = result?.face;
                    const dateNow = Date.now();
                    const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;
                    const idDetails = {
                        first_name: result?.data['FIRST_NAME'],
                        last_name: result?.data['LAST_NAME'],
                        date_of_birth:
                            typeof result?.data['DATE_OF_BIRTH'] === 'number'
                                ? new Date(result?.data['DATE_OF_BIRTH'])
                                : result?.data['DATE_OF_BIRTH'],
                        address: result?.data['ADDRESS'],
                        city: result?.data['CITY_IN_ADDRESS'],
                        state: result?.data['STATE_IN_ADDRESS'],
                        zipcode: result?.data['ZIP_CODE_IN_ADDRESS'],
                    };
                    if (idInformation.length < 3) {
                        setIDInformation((prev) => {
                            return [...prev, idDetails];
                        });
                    }

                    // Only set `capturedImage` and `faceImage` on the first successful response
                    if (
                        face &&
                        !faceImage &&
                        !capturedImage &&
                        isFirstResponse.current
                    ) {
                        isFirstResponse.current = false;

                        stopCapture();
                        setCapturedImage(
                            `data:image/png;base64,${result?.capturedImg}`,
                        );
                        dispatch(setGovernmentID(idCapture));
                        dispatch(
                            setIDFront(
                                `data:image/png;base64,${result?.capturedImg}`,
                            ),
                        );
                        uploadImagesToS3(
                            `data:image/png;base64,${result?.capturedImg}`,
                            idCapture,
                        );

                        const faceBase64 = `data:image/png;base64,${face[0]}`;
                        setFaceImage(faceBase64);
                        dispatch(setExtractedFaceImage(faceBase64));
                        const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
                        const proofId = idCapture.split('.')[0];
                        dispatch(setPassport(passportCapture));
                        uploadImagesToS3(faceBase64, passportCapture);
                        dispatch(setProofID(proofId));

                        console.log(idDetails);
                        dispatch(setIdDetails(idDetails));
                    }
                });
            }
        } catch (error) {
            console.error('Error capturing image. Please try again.');
        }
    }, [
        cameraRef,
        extractFace,
        // sendMessage,
        faceImage,
        dispatch,
        participant_id,
        preCaturedImage,
        capturedImage,
    ]);

    const startCapture = useCallback(() => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
        }
        captureIntervalRef.current = setInterval(captureFrame, 1000);
    }, [captureFrame]);

    const stopCapture = () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
        }
    };
    const handleLoaderClose = () => {
        setLoaderVisible(false);
    };

    const handleDocClose = () => {
        setIsLoading(true);
        startCapture();
        // startRecording(setPreCapturedImage);
        setDocTypeVisible(false);
    };

    const recaptureImage = () => {
        setCapturedImage(null);
        setFaceImage(null);
        setFaceImage('');
        setLoaderVisible(false);
        setDocTypeVisible(true);
        startCapture();
        // startRecording(setPreCapturedImage);
    };

    useEffect(() => {
        setDocTypeVisible(true);
    }, []);

    // useEffect(() => {
    //   if (isConnected && !isDocTypeVisible) {
    //     startCapture();
    //     // startRecording(setPreCapturedImage);
    //   }
    // }, [isConnected, isDocTypeVisible, startCapture]);

    // useEffect(() => {
    //   const dateNow = Date.now();
    //   const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;

    //   if (face && !faceImage && !capturedImage) {
    //     console.log("every now and then in here");
    //     stopCapture();
    //     setCapturedImage(preCaturedImage);
    //     dispatch(setGovernmentID(idCapture));
    //     dispatch(setIDFront(preCaturedImage!));
    //     uploadImagesToS3(preCaturedImage!, idCapture);

    //     const faceBase64 = `data:image/png;base64,${face[0]}`;
    //     setFaceImage(faceBase64);
    //     dispatch(setExtractedFaceImage(faceBase64));
    //     const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
    //     const proofId = idCapture.split(".")[0];
    //     dispatch(setPassport(passportCapture));
    //     dispatch(setProofID(proofId));
    //     uploadImagesToS3(faceBase64, passportCapture);
    //   }
    // }, [face, participant_id, dispatch, preCaturedImage]);

    return {
        capturedImage,
        faceImage,
        timeLeft,
        captureFrame,
        // isVisible,
        isLoaderVisible,
        isDocTypeVisible,
        isLoading,
        recaptureImage,
        handleDocClose,
        handleLoaderClose,
        // isConnected,
        errorMsg,
        idInformation,
        showCountdown,
    };
};
