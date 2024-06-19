'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { DocumentTypeModal, Button, ThumbnailGallery, AppHeader } from '@/components';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Crypto from "crypto-js";
import {
    ScanReportString,
    proofPassData_,
    appData,
    IdCardFacialPercentageScoreString,
    FacialCaptureString,
    idFrontString,
    selectScanReports,
    setScanReport
} from "@/redux/slices/appConfig";
import { Loader_ } from '@/components';

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
}

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
    const [formValues, setFormValues] = useState<ProofPassUploadType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formInitialized, setFormInitialized] = useState(false);


    // Selectors
    const proofPassData = useSelector(proofPassData_);
    const userData = useSelector(appData);
    const facialPercentageScore = useSelector(IdCardFacialPercentageScoreString);
    const facialUrl = useSelector(FacialCaptureString);
    const idUrl = useSelector(idFrontString);
    const scanReports = useSelector(selectScanReports);

    // Extract image names and images
    const imageNames = scanReports?.flatMap((obj: { [s: string]: string; } | ArrayLike<string>) => Object.keys(obj)).join(',');
    const extractImages = scanReports?.flatMap((obj: { [s: string]: string; } | ArrayLike<string>) => Object.values(obj));

    // Decrypt Function
    const decryptData = (encryptedData: string, secretKey: string | undefined) => {
        const bytes = Crypto.AES.decrypt(encryptedData, secretKey || '');
        return bytes.toString(Crypto.enc.Utf8);
    };

    const compressImage = useCallback(async (imageDataUrl: string, maxSizeMB = 1, maxWidthOrHeight = 800) => {
        if (!imageDataUrl.startsWith('data:image')) {
            throw new Error('Invalid data URL');
        }
        const imageFile = dataURLtoFile(imageDataUrl, 'image.png');
        const options = {
            maxSizeMB,
            maxWidthOrHeight,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        return fileToDataUrl(compressedFile);
    }, []);

    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        if (arr.length !== 2) {
            throw new Error("Invalid data URL");
        }
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) {
            throw new Error("Invalid data URL");
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

    const compressImages = useCallback(async (images: string[]) => {
        return await Promise.all(images.map((image: string) => compressImage(image)));
    }, [compressImage]);


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

    useEffect(() => {
        const initializeFormValues = async () => {
            const participant_id = localStorage.getItem("participant_id");
            const pin = localStorage.getItem("pin");

            if (participant_id && pin) {
                const decryptedId = decryptData(participant_id, process.env.NEXT_PUBLIC_SECRET_KEY);
                const decryptedPin = decryptData(pin, process.env.NEXT_PUBLIC_SECRET_KEY);

                let compressedPassportPhoto = '';
                if (userData.photo.startsWith('data:image')) {
                    compressedPassportPhoto = await compressImage(userData.photo);
                }

                let compressedIdUrl = '';
                if (userData.photo.startsWith('data:image')) {
                    compressedIdUrl = await compressImage(idUrl as any);
                }

                setFormValues({
                    participant_id: decryptedId,
                    pin: decryptedPin,
                    Collectiondate: proofPassData?.collectionDate || '',
                    firstvax: "",
                    secondvax: "",
                    service_type: proofPassData?.typeOfService?.value || '',
                    vaxbrand: "",
                    result: proofPassData?.result?.value || '',
                    panel: proofPassData?.panel || '',
                    specimen_id: "",
                    list_panel: "",
                    booster_shot_date: "",
                    booster_shot_brand: "",
                    result_percentage: "",
                    type_exemption: "",
                    detail_exemption: "",
                    agree_disagree: "",
                    alco_result: "",
                    rapidkit_id_barcode: "",
                    rapidkit_shipping_barcode: "",
                    strip_result_history: "",
                    proof_id: userData.proof_id_value,
                    government_photo_url: compressedIdUrl,
                    passport_photo_url: compressedPassportPhoto,
                    face_scan1_percentage: facialPercentageScore,
                    face_scan1_url: facialUrl,
                    first_name: proofPassData?.firstName || '',
                    last_name: proofPassData?.lastName || '',
                    middle_name: "",
                    date_of_birth: userData.birth_date,
                    address: userData.Address_Line_1,
                    city: userData.City,
                    state: userData.State,
                    zipcode: userData.Zip_Code,
                    imagenames: imageNames,
                    scanReport: ''
                });

                setFormInitialized(true);
            }
        };

        initializeFormValues();
    }, [compressImage, facialPercentageScore, facialUrl, idUrl, imageNames, proofPassData?.collectionDate, proofPassData?.firstName, proofPassData?.lastName, proofPassData?.panel, proofPassData?.result?.value, proofPassData?.typeOfService?.value, scanReports, userData.Address_Line_1, userData.City, userData.State, userData.Zip_Code, userData.birth_date, userData.photo, userData.proof_id_value]);


    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const compressedImages = await compressImages(extractImages);
            const xmlImages = `
                <Images>
                    ${compressedImages.map((image: string) => `<Picture>${image.split(",")[1]}</Picture>`).join('\n  ')}
                </Images>
            `;

            if (!formValues) {
                throw new Error("Form values are not set");
            }

            const finalFormValues = { ...formValues, scanReport: xmlImages };

            const response = await fetch("/api/proof-pass-upload", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalFormValues),
            });

            if (response.ok) {
                toast.success("Data submitted successfully");
                setTimeout(() => {
                    router.push('/home');
                }, 5000);
            } else {
                toast.error("Error submitting data");
                setTimeout(() => {
                    router.push('/proof-pass/proof-pass-upload');
                }, 5000);
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
                {showCamera && !isLoading && (
                    <Button blue disabled={false} type="submit" onClick={captureFrame} style={{ position: 'absolute', bottom: '2rem', width: '90%' }}>
                        Capture
                    </Button>
                )}
                {scanReports.length > 0 || showCamera ? '' : <p style={{ position: 'absolute', bottom: '50%', top: '50%', textAlign: 'center', padding: '16px' }}>Press the Add button with + to take a photo of your test result.</p>}

                {!showCamera && !isLoading &&
                    < ThumbnailGallery images={scanReports} />
                }

                {isLoading && <Loader_ />}
            </div>

            {!showCamera && !isLoading &&
                <div className='proof-pass-button-container'>
                    <Button white classname="prompt-yes-btn w-scan-btn" style={{ width: '150px' }} onClick={() => {
                        setShowModal(true);
                        setShowCamera(false);
                    }}>
                        + Add
                    </Button>
                    <Button blue classname="prompt-yes-btn w-scan-btn" style={{ width: '150px' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            }

        </div>

    );
};
export default ScanLabReport;
