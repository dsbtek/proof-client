import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import { appData } from '@/redux/slices/appConfig';
import { authToken } from '@/redux/slices/auth';
import { saveConfirmationNo, testData, setUploadStatus } from '@/redux/slices/drugTest';
import { base64ToBlob, blobToBase64, blobToBuffer, dateTimeInstance } from '@/utils/utils';
import { createPresignedUrl } from '@/app/test-collection/[slug]/action';
import { toast } from 'react-toastify';

function useTestupload() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { testSteps, testStepsFiltered, timerObjs, testingKit, startTime, endTime, signature, barcode } = useSelector(testData);
    const { participant_id } = useSelector(authToken);
    const { first_name, last_name } = useSelector(appData);

    const testUpload = useCallback(async () => {
        try {
            const response = await fetch("/api/test-upload", {
                method: "POST",
                headers: {
                    participant_id: participant_id as string,
                    url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.mp4',
                    photo_url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    start_time: startTime,
                    end_time: endTime,
                    submitted: '1706033912',
                    barcode_string: barcode,
                    internet_connection: 'true',
                    app_version: '1.0.0',
                    os_version: '14.6',
                    phone_model: 'iPhone 12',
                    device_name: 'iPhone 12',
                    device_storage: '64GB',
                    look_away_time: '0',
                    hand_out_of_frame: '0',
                    drugkitname: testingKit.kit_name,
                    tracking_number: '1234567890',
                    shippinglabelURL: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    scan_barcode_kit_value: '1234567890',
                    detect_kit_value: '1234567890',
                    signature_screenshot: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
                    proof_id: '1234567890',
                    face_compare_url: '',
                    face_scan1_url: '',
                    face_scan2_url: '',
                    face_scan3_url: '',
                    face_scan1_percentage: '100',
                    face_scan2_percentage: '100',
                    face_scan3_percentage: '100',
                    image_capture1_url: '',
                    image_capture2_url: '',
                    passport_photo_url: '',
                    government_photo_url: '',
                    first_name: first_name,
                    last_name: last_name,
                    date_of_birth: '1990-01-01',
                    address: '1234 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipcode: '12345',
                },
            });
            const data = await response.json();
            if (data.data.statusCode === 200) {
                console.log(data.data);
                dispatch(saveConfirmationNo(data.data.confirmationNum));
                return data.data;
            } else {
                console.error(data.data);
            }
        } catch (error) {
            console.error("Self Drug Test Upload error:", error);
        }
    }, [barcode, dispatch, endTime, first_name, last_name, participant_id, startTime, testingKit.kit_name]);


    const uploader = useCallback(async (blob: Blob, pendingTest?: () => void) => {
        try {
            const webmBlob = new Blob([blob], { type: 'video/mp4' });
            const unencodedString = await blobToBase64(webmBlob);
            const filename = `${Date.now()}-${testingKit.kit_id}.mp4`
            let success = false;

            // const encodedResponse = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/convert-to-mp4`, {
            //     method: "POST",
            //     headers: {
            //         "Accept": "*/*",
            //         "Accept-Encoding": "gzip, deflate",
            //         "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
            //         "Content-Type": "application/json",
            //         "Connection": "keep-alive"
            //     },
            //     body: JSON.stringify({
            //         "base64_chunk": unencodedString,
            //     })
            // })

            // const encodedString = await encodedResponse.json();
            // const encodedBlob = await base64ToBlob(encodedString.result.base64_output, 'video/mp4')
            // const buffer = await blobToBuffer(encodedBlob!);
            const buffer = await blobToBuffer(webmBlob!);

            dispatch(setUploadStatus(true));

            await testUpload()

            await createPresignedUrl(filename).then(async (response: any) => {
                if (response) {
                    const url = response;
                    await fetch(url, {
                        method: 'PUT',
                        body: buffer as Buffer,
                        headers: { "Content-Length": blob!.size as unknown as string }
                    }).then(async (response) => {
                        console.log('s3 res:', response)
                        if (response.ok && response.status === 200) {
                            dispatch(setUploadStatus(false));
                            fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/convert-to-mp4`, {
                                method: "POST",
                                headers: {
                                    "Accept": "*/*",
                                    "Accept-Encoding": "gzip, deflate",
                                    "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                                    "Content-Type": "application/json",
                                    "Connection": "keep-alive"
                                },
                                body: JSON.stringify({
                                    "uri": filename,
                                })
                            })
                            success = true;
                        } else {
                            pendingTest?.();
                            toast.error('Error uploading video');
                        }
                    }).catch((error) => {
                        pendingTest?.();
                        console.error('S3 Upload Error:', error)
                    });
                }
            }).catch((error) => {
                pendingTest?.();
                toast.error('Error creating Presigned URL');
                console.error('Presigned URL Error:', error);
            });

            return success;
        } catch (error) {
            pendingTest?.();
            console.error("Upload error:", error);
        }
    }, [testUpload, dispatch, testingKit.kit_id]);

    return { uploader, testUpload }
};

export default useTestupload;