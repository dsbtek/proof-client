'use client';

import { useState, useRef, useCallback, useEffect, ChangeEvent } from 'react';
import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    DocumentTypeModal,
    Button,
    ThumbnailGallery,
    AppHeader,
    FileUpload,
} from '@/components';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Crypto from 'crypto-js';
import {
    ScanReportString,
    proofPassData_,
    appData,
    IdCardFacialPercentageScoreString,
    FacialCaptureString,
    idFrontString,
    selectScanReports,
    setScanReport,
} from '@/redux/slices/appConfig';
import { Loader_ } from '@/components';
import { testData } from '@/redux/slices/drugTest';
import { authToken } from '@/redux/slices/auth';

interface ProofPassUploadType {
    participant_id: string;
    pin: string;
    Collectiondate: string;
    firstvax: string;
    secondvax: string;
    service_type: string;
    vaxbrand: string;
    result: string;
    panel: string;
    specimen_id: string;
    list_panel: string;
    booster_shot_date: string;
    booster_shot_brand: string;
    result_percentage: string;
    type_exemption: string;
    detail_exemption: string;
    agree_disagree: string;
    alco_result: string;
    rapidkit_id_barcode: string;
    rapidkit_shipping_barcode: string;
    strip_result_history: string;
    proof_id: string;
    government_photo_url: string;
    passport_photo_url: string;
    face_scan1_percentage: string | undefined;
    face_scan1_url: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    imagenames: string;
    scanReport: string;
    face_compare_url: string;
    face_scan2_url: string;
    face_scan3_url: string;
    face_scan2_percentage: string;
    face_scan3_percentage: string;
    image_capture1_url: string;
    image_capture2_url: string;
}

const storageBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN;

const ScanLabReport = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] =
        useState<boolean>(false);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toggleUpload, setToggleUpload] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [imageName, setImageName] = useState<string>('');
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState<ProofPassUploadType | null>(
        null,
    );
    const { participant_id, pin } = useSelector(authToken);

    const {
        storage,
        lookAway,
        handsOut,
        filename,
        testingKit,
        startTime,
        endTime,
        signature,
        barcode,
        trackingNumber,
        shippingLabel,
        barcodeKit,
        detectKit,
        proofId,
        faceCompare,
        faceScans,
        imageCaptures,
        passport,
        governmentID,
        idDetails,
    } = useSelector(testData);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formInitialized, setFormInitialized] = useState(false);
    const [fileUpload_, setFileUpload] = useState(false);

    // Selectors
    const proofPassData = useSelector(proofPassData_);
    const userData = useSelector(appData);
    const facialPercentageScore = useSelector(
        IdCardFacialPercentageScoreString,
    );
    const facialUrl = useSelector(FacialCaptureString);
    const idUrl = useSelector(idFrontString);
    const scanReports = useSelector(selectScanReports);
    // const { barcodeKit, trackingNumber } = useSelector(testData);

    const handleUpload = (base64String: string) => {
        console.log('Base64 String: ', base64String);
        setCapturedImage(base64String);
        setFileUpload(true);
        setShowModal(true);
        setShowCamera(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
    };

    const handleClose = () => {
        console.log('Upload canceled');
    };
    // Extract image names and images
    const imageNames = scanReports
        ?.flatMap((obj: { [s: string]: string } | ArrayLike<string>) =>
            Object.keys(obj),
        )
        .join(',');
    const extractImages = scanReports?.flatMap(
        (obj: { [s: string]: string } | ArrayLike<string>) =>
            Object.values(obj),
    );

    // Decrypt Function
    const decryptData = (
        encryptedData: string,
        secretKey: string | undefined,
    ) => {
        const bytes = Crypto.AES.decrypt(encryptedData, secretKey || '');
        return bytes.toString(Crypto.enc.Utf8);
    };

    const compressImage = useCallback(
        async (
            imageDataUrl: string,
            maxSizeMB = 2,
            maxWidthOrHeight = 1080,
        ) => {
            const imageFile = dataURLtoFile(imageDataUrl, 'image.png');
            const options = {
                maxSizeMB,
                maxWidthOrHeight,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(imageFile, options);
            return fileToDataUrl(compressedFile);
        },
        [], // Add any dependencies here if needed
    );

    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        if (arr.length !== 2) {
            throw new Error('Invalid data URL');
        }
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) {
            throw new Error('Invalid data URL');
        }
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const fileToDataUrl = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const compressImages = useCallback(
        async (images: string[]) => {
            return await Promise.all(
                images.map((image: string) => compressImage(image)),
            );
        },
        [compressImage],
    );

    const initCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === 'videoinput',
            );
            setCameras(videoDevices);

            if (videoDevices.length === 1) {
                setSelectedCamera(videoDevices[0].deviceId);
            }

            if (videoDevices.length > 0) {
                setPermissionsGranted(true);
            }
        } catch (error) {
            toast.error(
                'Error accessing camera. Please allow camera access to continue.',
            );
            console.error('Error accessing camera:', error);
        }
    }, []);

    const captureFrame = () => {
        const video = cameraRef.current?.video;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageSrc = canvas.toDataURL('image/png', 1.0);
            dispatch(setScanReport({ [imageName]: imageSrc }));
            setCapturedImage(imageSrc);
            setShowCamera(false);
        } else {
            console.error('Video element not found');
        }
    };

    useEffect(() => {
        if (showCamera) {
            initCamera();
        }
    }, [showCamera, initCamera]);
    useEffect(() => {
        const initializeFormValues = async () => {
            if (participant_id && pin) {
                let compressedPassportPhoto = '';
                if (userData.photo.startsWith('data:image')) {
                    compressedPassportPhoto = await compressImage(
                        userData.photo,
                    );
                }

                let compressedIdUrl = '';
                if (userData.photo.startsWith('data:image')) {
                    compressedIdUrl = await compressImage(idUrl as any);
                }

                let compressedFacialUrl = '';
                if (facialUrl.startsWith('data:image')) {
                    compressedIdUrl = await compressImage(facialUrl as any);
                }

                setFormValues({
                    participant_id: participant_id as string,
                    pin: pin as string,
                    Collectiondate: proofPassData?.collectionDate || '',
                    firstvax: '',
                    secondvax: '',
                    service_type: proofPassData?.typeOfService?.value || '',
                    vaxbrand: '',
                    result: proofPassData?.result?.value || '',
                    panel: proofPassData?.panel || '',
                    specimen_id: '',
                    list_panel: '',
                    booster_shot_date: '',
                    booster_shot_brand: '',
                    result_percentage: '',
                    type_exemption: '',
                    detail_exemption: '',
                    agree_disagree: '',
                    alco_result: '',
                    rapidkit_id_barcode: barcodeKit,
                    rapidkit_shipping_barcode: trackingNumber,
                    strip_result_history: '',
                    proof_id: userData.proof_id_value,
                    first_name: proofPassData?.firstName || '',
                    last_name: proofPassData?.lastName || '',
                    middle_name: '',
                    date_of_birth: userData.birth_date,
                    address: userData.Address_Line_1,
                    city: userData.City,
                    state: userData.State,
                    zipcode: userData.Zip_Code,
                    imagenames: imageNames,
                    scanReport: '',
                    face_compare_url: faceCompare ? `${faceCompare}` : '',
                    face_scan1_url: faceScans[0] ? `${faceScans[0]?.url}` : '',
                    face_scan2_url: faceScans[1] ? `${faceScans[1]?.url}` : '',
                    face_scan3_url: faceScans[2] ? `${faceScans[2]?.url}` : '',
                    face_scan1_percentage: faceScans[0]
                        ? `${faceScans[0]?.percentage}`
                        : '',
                    face_scan2_percentage: faceScans[1]
                        ? `${faceScans[1]?.percentage}`
                        : '',
                    face_scan3_percentage: faceScans[2]
                        ? `${faceScans[2]?.percentage}`
                        : '',
                    image_capture1_url: imageCaptures
                        ? `${imageCaptures[0]!}`
                        : '',
                    image_capture2_url: imageCaptures
                        ? `${imageCaptures[1]!}`
                        : '',
                    passport_photo_url: passport ? `${passport}` : '',
                    government_photo_url: governmentID ? `${governmentID}` : '',
                });

                setFormInitialized(true);
            }
        };

        initializeFormValues();
    }, [
        barcodeKit,
        compressImage,
        facialPercentageScore,
        facialUrl,
        idUrl,
        imageNames,
        proofPassData?.collectionDate,
        proofPassData?.firstName,
        proofPassData?.lastName,
        proofPassData?.panel,
        proofPassData?.result?.value,
        proofPassData?.typeOfService?.value,
        scanReports,
        trackingNumber,
        userData.Address_Line_1,
        userData.City,
        userData.State,
        userData.Zip_Code,
        userData.birth_date,
        userData.photo,
        userData.proof_id_value,
    ]);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const compressedImages = await compressImages(extractImages);
            const xmlImages = `
                <Images>
                    ${compressedImages
                        .map(
                            (image: string) =>
                                `<Picture>${image.split(',')[1]}</Picture>`,
                        )
                        .join('\n  ')}
                </Images>
            `;

            if (!formValues) {
                throw new Error('Form values are not set');
            }

            const finalFormValues = { ...formValues, scanReport: xmlImages };

            const response = await fetch('/api/proof-pass-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalFormValues),
            });
            if (response.ok) {
                toast.success('Data submitted successfully');
                setTimeout(() => {
                    router.push('/home');
                }, 5000);
            } else {
                toast.error('Error submitting data');
                // setTimeout(() => {
                //     router.push('/proof-pass/proof-pass-upload');
                // }, 5000);
            }
        } catch (error) {
            toast.warning(`Error: ${error}`);
            setTimeout(() => {
                router.push('/home');
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    }, [compressImages, extractImages, formValues, router]);

    const videoConstraints = {
        deviceId: selectedCamera,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'environment',
    };

    return (
        <div
            className="container"
            style={{ position: 'relative', height: '100vh' }}
        >
            <AppHeader title="PROOFpass Upload" hasMute={false} />
            {showModal && (
                <DocumentTypeModal
                    onClose={() => {
                        setShowModal(false);
                        // setShowCamera(true);
                    }}
                    setImageName={setImageName}
                    triggerCameraFileUpload={() => {
                        setShowModal(false);
                        if (fileUpload_) {
                            setFileUpload(false);
                            dispatch(
                                setScanReport({ [imageName]: capturedImage }),
                            );
                            return;
                        } else {
                            setShowCamera(true);
                        }
                    }}
                />
            )}
            <div className="proof-pass-camera-wrapper">
                {permissionsGranted && showCamera && (
                    <>
                        {cameras.length > 1 && (
                            <select
                                onChange={(e) =>
                                    setSelectedCamera(e.target.value)
                                }
                                value={selectedCamera}
                            >
                                <option value="">Select a camera</option>
                                {cameras.map((camera) => (
                                    <option
                                        key={camera.deviceId}
                                        value={camera.deviceId}
                                    >
                                        {camera.label ||
                                            `Camera ${camera.deviceId}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        {selectedCamera && (
                            <Webcam
                                className="proof-pass-camera-container"
                                ref={cameraRef}
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={videoConstraints}
                                imageSmoothing={true}
                                screenshotQuality={1}
                            />
                        )}
                    </>
                )}
                {showCamera && !isLoading && (
                    <Button
                        blue
                        disabled={false}
                        type="submit"
                        onClick={captureFrame}
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            width: '90%',
                        }}
                    >
                        Capture
                    </Button>
                )}
                {scanReports.length > 0 || showCamera ? (
                    ''
                ) : (
                    <p
                        style={{
                            position: 'absolute',
                            bottom: '50%',
                            top: '50%',
                            textAlign: 'center',
                            padding: '16px',
                        }}
                    >
                        Press the Add button with + to take a photo of your test
                        result.
                    </p>
                )}

                {!showCamera && !isLoading && (
                    <ThumbnailGallery images={scanReports} />
                )}

                {isLoading && <Loader_ />}
            </div>
            {!showCamera && !isLoading && (
                <div className="proof-pass-button-container">
                    <div className="add-doc">
                        <Button
                            white
                            classname="prompt-yes-btn w-scan-btn"
                            style={{ width: '50%' }}
                            onClick={() => {
                                setShowModal(true);
                                setShowCamera(false);
                            }}
                        >
                            + Add
                        </Button>
                        <FileUpload
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                            }}
                            onUpload={handleUpload}
                            onClose={handleClose}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        blue
                        classname="prompt-yes-btn w-scan-btn"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            )}
        </div>
    );
};
export default ScanLabReport;
