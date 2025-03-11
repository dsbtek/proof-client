'use client';

import {
    AppHeader,
    Button,
    FileUpload,
    Loader_,
    SelectComponent,
    ThumbnailGallery,
} from '@/components';
import {
    appData,
    FacialCaptureString,
    IdCardFacialPercentageScoreString,
    idFrontString,
    proofPassData_,
    selectScanReports,
    setScanReport,
} from '@/redux/slices/appConfig';
import { authToken } from '@/redux/slices/auth';
import { testData } from '@/redux/slices/drugTest';
import imageCompression from 'browser-image-compression';
import Crypto from 'crypto-js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CgAdd } from 'react-icons/cg';
import { WiCloudUp } from 'react-icons/wi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

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

export const typeOfImages = [
    {
        id: 1,
        value: 'Lab Report',
        label: 'Lab Report',
    },
    {
        id: 2,
        value: 'Chain of Custody',
        label: 'Chain of Custody',
    },
    {
        id: 3,
        value: 'Rapid Test Device',
        label: 'Rapid Test Device',
    },
];

const storageBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN;

const DesktopScanLabReport = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] =
        useState<boolean>(false);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [imageName, setImageName] = useState<string>('');
    const cameraRef = useRef<Webcam | null>(null);
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState<ProofPassUploadType | null>(
        null,
    );
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
    const [fileUpload, setFileUpload] = useState(false);
    const { participant_id, pin } = useSelector(authToken);

    // Selectors
    const proofPassData = useSelector(proofPassData_);
    const userData = useSelector(appData);
    const facialPercentageScore = useSelector(
        IdCardFacialPercentageScoreString,
    );
    const facialUrl = useSelector(FacialCaptureString);
    const idUrl = useSelector(idFrontString);
    const scanReports = useSelector(selectScanReports);

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

    const handleUpload = (base64String: string) => {
        console.log('Base64 String: ', base64String);
        setCapturedImage(base64String);
        dispatch(setScanReport({ [imageName]: base64String }));
        // setFileUpload(true);
        // setShowModal(true);
        // setShowCamera(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
    };

    const handleClose = () => {
        console.log('Upload canceled');
    };

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
            setShowModal(false);
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
                    rapidkit_id_barcode: '',
                    rapidkit_shipping_barcode: '',
                    strip_result_history: '',
                    proof_id: userData.proof_id_value,
                    // government_photo_url: compressedIdUrl,
                    // passport_photo_url: compressedPassportPhoto,
                    // face_scan1_percentage: facialPercentageScore,
                    // face_scan1_url: compressedFacialUrl,
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

    const handleFileInput = (
        event: React.ChangeEvent<HTMLInputElement>,
        onFileSelect: (file: File) => void,
    ) => {
        setShowModal(true);
        setFileUpload(true);
        setShowCamera(false);
        if (event.target.files && event.target.files.length > 0) {
            onFileSelect(event.target.files[0]);
        }
    };

    return (
        <div
            className="proofpass-upload-container"
            style={{ position: 'relative', height: '100dvh' }}
        >
            {/* <AgreementHeader title="PROOFpass Upload" /> */}
            <div style={{ height: '100px', width: '100%' }}>
                <AppHeader title="PROOFpass Upload" hasMute={false} />
            </div>
            {showModal && (
                <div
                    className="modal-overlay-document-type"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="proof-pass-camera-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {permissionsGranted && showCamera && (
                            <>
                                {cameras.length > 1 && (
                                    <select
                                        onChange={(e) =>
                                            setSelectedCamera(e.target.value)
                                        }
                                        value={selectedCamera}
                                    >
                                        <option value="">
                                            Select a camera
                                        </option>
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
                                        videoConstraints={{
                                            deviceId: selectedCamera,
                                        }}
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
                    </div>
                    {/* </div> */}
                </div>
            )}

            <div className="form-wrap">
                <h4>Take a photo </h4>
                <p
                    style={{
                        textAlign: 'center',
                        padding: '16px',
                    }}
                >
                    Please capture and upload a photo of your test document.
                </p>

                <SelectComponent
                    className=""
                    data={typeOfImages}
                    placeholder="Type of services"
                    name="typeOfService"
                    value={
                        typeOfImages.find((i) => i?.value === imageName) as {
                            id: number;
                            value: string;
                            label: string;
                        }
                    }
                    onChange={(option) => setImageName(option?.value as string)}
                />

                <div className="upload-box">
                    <WiCloudUp size={48} color="#009CF9" />
                    <h5>Upload Document Image</h5>
                    <p
                        style={{
                            textAlign: 'center',
                            padding: '16px',
                        }}
                    >
                        Please add document image and then submit your image.
                    </p>
                    {!showCamera && !isLoading && (
                        <ThumbnailGallery images={scanReports} />
                    )}
                    <Button
                        type="reset"
                        classname="add-button"
                        style={{}}
                        onClick={() => {
                            setShowModal(true);
                            setShowCamera(true);
                        }}
                    >
                        <CgAdd size={20} color="#4E555D" /> Add
                    </Button>
                    <FileUpload
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
            {isLoading && <Loader_ />}
        </div>
    );
};
export default DesktopScanLabReport;
