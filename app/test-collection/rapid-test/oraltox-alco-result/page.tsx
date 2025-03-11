'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { testData, testingKit } from '@/redux/slices/drugTest';
import {
    AgreementHeader,
    AgreementFooter,
    AppHeader,
    AppContainer,
    AppHeaderDesktop,
} from '@/components';
import useResponsive from '@/hooks/useResponsive';
import { useSelector } from 'react-redux';
import {
    agreeDisagreeStr,
    alcoholImgStr,
    appData,
    alcoholResultStr,
    oraltoxResultStr,
    oraltoxStripHistoryStr,
    alcoStripHistoryStr,
    FacialCaptureString,
    IdCardFacialPercentageScoreString,
    idFrontString,
    oraltoxImgStr,
    proofPassData_,
    selectScanReports,
} from '@/redux/slices/appConfig';
import { authToken } from '@/redux/slices/auth';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Crypto from 'crypto-js';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    face_scan1_percentage: string;
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
    face_compare_url: string;
    face_scan2_url: string;
    face_scan3_url: string;
    face_scan2_percentage: string;
    face_scan3_percentage: string;
    image_capture1_url: string;
    image_capture2_url: string;
}

const storageBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN;

const RapidTest = () => {
    const router = useRouter();
    const isDesktop = useResponsive();
    const kitName = useSelector(testingKit);
    const alcoholImg = useSelector(alcoholImgStr);
    const oraltoxImg = useSelector(oraltoxImgStr);
    const alcoholRes = useSelector(alcoholResultStr);
    const oraltoxRes = useSelector(oraltoxResultStr);
    const oraltoxStripHis = useSelector(oraltoxStripHistoryStr);
    const alcoholStripHis = useSelector(alcoStripHistoryStr);
    const agree_ = useSelector(agreeDisagreeStr);
    const feedbackData = useSelector(
        (state: any) => state.preTest.preTestFeedback,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleteLoading, setIsCompleteLoading] = useState(false);
    const [formValues, setFormValues] = useState<ProofPassUploadType | null>(
        null,
    );
    const [formInitialized, setFormInitialized] = useState(false);
    const { faceCompare, faceScans, imageCaptures, passport, governmentID } =
        useSelector(testData);
    const { participant_id, pin } = useSelector(authToken);

    // Selectors
    const userData = useSelector(appData);
    const facialPercentageScore = useSelector(
        IdCardFacialPercentageScoreString,
    );
    const facialUrl = useSelector(FacialCaptureString);
    const idUrl = useSelector(idFrontString);
    const scanReports = useSelector(selectScanReports);

    const formattedString = `OralTox;${oraltoxStripHis
        .map(
            (result) =>
                `Strip ${result.id} Old Result: ${result['Old Result']}, Strip ${result.id} New Result: ${result['New Result']}`,
        )
        .join(';')};`;
    const strip_result_history = alcoholStripHis + formattedString;
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

    const compressImage = useCallback(
        async (imageDataUrl: string, maxSizeMB = 1, maxWidthOrHeight = 900) => {
            const imageFile = dataURLtoFile(imageDataUrl, 'image.png');
            const options = {
                maxSizeMB,
                maxWidthOrHeight,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(imageFile, options);
            return fileToDataUrl(compressedFile);
        },
        [],
    );

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

    // Decrypt Function
    const decryptData = (
        encryptedData: string,
        secretKey: string | undefined,
    ) => {
        const bytes = Crypto.AES.decrypt(encryptedData, secretKey || '');
        return bytes.toString(Crypto.enc.Utf8);
    };

    useEffect(() => {
        const initializeFormValues = async () => {
            if (participant_id && pin) {
                let compressedPassportPhoto = '';
                if (userData.photo?.startsWith('data:image')) {
                    compressedPassportPhoto = await compressImage(
                        userData.photo,
                    );
                }

                let compressedIdUrl = '';
                if (typeof idUrl === 'string') {
                    if (idUrl?.startsWith('data:image')) {
                        compressedIdUrl = await compressImage(idUrl as any);
                    }
                }

                // Helper function to format day with leading zero
                const formatDay = (day: number) => {
                    return day < 10 ? `0${day}` : `${day}`;
                };

                // Helper function to format month with leading zero
                const formatMonth = (month: number) => {
                    return month < 10 ? `0${month}` : `${month}`;
                };

                // Helper function to format date in DD-MM-YYYY format
                const formatDate = (date: Date): string => {
                    const day = formatDay(date.getDate());
                    const month = formatMonth(date.getMonth() + 1);
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                };

                let compressedFacialUrl = '';
                if (facialUrl?.startsWith('data:image')) {
                    compressedFacialUrl = await compressImage(facialUrl as any);
                }
                setFormValues({
                    participant_id: participant_id as string,
                    pin: pin as string,
                    Collectiondate: formatDate(new Date() as any),
                    firstvax: '',
                    secondvax: '',
                    service_type: 'AlcoOralTox',
                    vaxbrand: '',
                    result: oraltoxRes,
                    panel: '',
                    specimen_id: '',
                    list_panel: '',
                    booster_shot_date: '',
                    booster_shot_brand: '',
                    result_percentage: facialPercentageScore as any,
                    type_exemption: '',
                    detail_exemption: '',
                    agree_disagree: agree_,
                    alco_result: alcoholRes,
                    rapidkit_id_barcode: '',
                    rapidkit_shipping_barcode: '',
                    strip_result_history: strip_result_history,
                    proof_id: userData?.proof_id || '',
                    first_name: userData?.first_name || '',
                    last_name: userData?.last_name || '',
                    middle_name: userData?.middle_name || '',
                    date_of_birth: userData?.birth_date || '',
                    address: userData?.Address_Line_1 || '',
                    city: userData?.City || '',
                    state: userData?.State || '',
                    zipcode: userData?.Zip_Code || '',
                    imagenames: 'Alco, Oraltox',
                    face_compare_url: faceCompare
                        ? `${storageBucket}/${faceCompare}`
                        : '',
                    face_scan1_url: faceScans[0]
                        ? `${storageBucket}/${faceScans[0]?.url}`
                        : '',
                    face_scan2_url: faceScans[1]
                        ? `${storageBucket}/${faceScans[1]?.url}`
                        : '',
                    face_scan3_url: faceScans[2]
                        ? `${storageBucket}/${faceScans[2]?.url}`
                        : '',
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
                        ? `${storageBucket}/${imageCaptures[0]!}`
                        : '',
                    image_capture2_url: imageCaptures
                        ? `${storageBucket}/${imageCaptures[1]!}`
                        : '',
                    passport_photo_url: passport
                        ? `${storageBucket}/${passport}`
                        : '',
                    government_photo_url: governmentID
                        ? `${storageBucket}/${governmentID}`
                        : '',
                });

                setFormInitialized(true);
            }
        };

        initializeFormValues();
    }, [
        compressImage,
        decryptData,
        facialPercentageScore,
        facialUrl,
        idUrl,
        scanReports,
        userData,
    ]);

    const handleSubmit = useCallback(async () => {
        if (!formValues) {
            toast.error('Form values are not set');
            return;
        }

        setIsLoading(true);
        try {
            const compressedImages = await compressImages([
                alcoholImg,
                oraltoxImg,
            ]);
            const xmlImages = `<Images>${compressedImages
                .map(
                    (image: string) =>
                        `<Picture>${image.split(',')[1]}</Picture>`,
                )
                .join('\n  ')}</Images>`;

            // Build headers dynamically, ensuring all values are strings
            const data: Record<string, string> = {
                participant_id: formValues.participant_id,
                pin: formValues.pin,
                Collectiondate: formValues.Collectiondate,
                firstvax: formValues.firstvax,
                secondvax: formValues.secondvax,
                service_type: formValues.service_type,
                vaxbrand: formValues.vaxbrand,
                result: formValues.result,
                panel: formValues.panel,
                specimen_id: formValues.panel,
                list_panel: formValues.list_panel,
                booster_shot_date: formValues.booster_shot_date,
                booster_shot_brand: formValues.booster_shot_brand,
                result_percentage: formValues.result_percentage,
                type_exemption: formValues.type_exemption,
                detail_exemption: formValues.detail_exemption,
                agree_disagree: formValues.agree_disagree,
                alco_result: formValues.alco_result,
                rapidkit_id_barcode: formValues.rapidkit_id_barcode,
                rapidkit_shipping_barcode: formValues.rapidkit_shipping_barcode,
                strip_result_history: formValues.strip_result_history,
                proof_id: formValues.proof_id,
                government_photo_url: formValues.government_photo_url,
                passport_photo_url: formValues.passport_photo_url,
                face_scan1_percentage: formValues.face_scan1_percentage,
                face_scan1_url: formValues.face_scan1_url,
                first_name: formValues.first_name,
                last_name: formValues.last_name,
                middle_name: formValues.middle_name,
                date_of_birth: formValues.date_of_birth || '',
                address: formValues.address || '',
                city: formValues.city || '',
                state: formValues.state || '',
                zipcode: formValues.zipcode || '',
                imagenames: formValues.imagenames,
                scanReport: xmlImages,
                'Content-Type': 'Application/json',
            };

            const response = await fetch('/api/proof-pass-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success('Data submitted successfully');
                setIsCompleteLoading(true);
            } else {
                toast.error('Error submitting data');
            }
        } catch (error) {
            toast.error(`Error: ${error}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                if (feedbackData?.length > 0) {
                    router.push('/feedback');
                } else {
                    router.push('/test-collection/collection-summary');
                }
            }, 5000);
        }
    }, [formValues, alcoholImg, oraltoxImg, feedbackData, router]);

    return (
        <AppContainer
            header={<AppHeader title={kitName.kit_name} hasMute={false} />}
            body={
                !isDesktop ? (
                    <div className="agreement-items-wrap">
                        <p className="alco-text-title">Note</p>
                        <br />
                        <br />

                        <p className="with-bullet">
                            Please do not use the back button until you see a
                            confirmation that your photos have been successfully
                            saved.
                        </p>
                        <br />
                        <div
                            className="wrap-img"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '16px',
                                backgroundColor: 'black',
                                color: 'white',
                                overflowY: 'scroll',
                            }}
                        >
                            <p>Alco</p>
                            <Image
                                className="alco-oraltox-img-result"
                                src={alcoholImg}
                                alt="alco-test"
                                width={3000}
                                height={3000}
                            />
                            <p>OralTox</p>
                            <Image
                                className="alco-oraltox-img-result"
                                src={oraltoxImg}
                                alt="alco-test"
                                width={3000}
                                height={3000}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="test-items-wrap-desktop_">
                        <div
                            className="sub-item"
                            style={{ paddingRight: '10%' }}
                        >
                            <p className="alco-text-title">Note</p>
                            <br />
                            <br />

                            <p className="with-bullet">
                                Please do not use the back button until you see
                                a confirmation that your photos have been
                                successfully saved.
                            </p>
                        </div>
                        <div
                            className="wrap-img"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '16px',
                                backgroundColor: isDesktop ? 'black' : 'white',
                                color: 'white',
                                overflowY: 'scroll',
                            }}
                        >
                            <p>Alco</p>
                            <Image
                                className="alco-oraltox-img-result"
                                src={alcoholImg}
                                alt="alco-test"
                                width={3000}
                                height={3000}
                            />
                            <p>OralTox</p>
                            <Image
                                className="alco-oraltox-img-result"
                                src={oraltoxImg}
                                alt="alco-test"
                                width={3000}
                                height={3000}
                            />
                        </div>
                    </div>
                )
            }
            footer={
                <AgreementFooter
                    currentNumber={3}
                    outOf={4}
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    btnLeftLink={''}
                    btnRightLink={
                        isCompleteLoading && feedbackData?.length > 0
                            ? '/feedback'
                            : '/test-collection/collection-summary'
                    }
                    onClickBtnRightAction={
                        !isCompleteLoading ? handleSubmit : () => {}
                    }
                    btnLeftText={'Decline'}
                    btnRightText={isCompleteLoading ? 'Next' : 'Submit'}
                />
            }
        />
    );
};
export default RapidTest;
