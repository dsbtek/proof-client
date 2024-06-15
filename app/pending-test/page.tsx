'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Crypto from "crypto-js";

import { Menu, AppHeader, Button } from '@/components';
import { createPresignedUrl, uploadVideoToS3 } from '../test-collection/[slug]/action';
import { saveTestClip, setEndTime, setStartTime, setUploadStatus, testData, saveConfirmationNo } from '@/redux/slices/drugTest';
import { retrieveBlobFromIndexedDB, checkDatabaseAndObjectStore, deleteBlobFromIndexedDB } from '@/utils/indexedDB';
import { authToken } from '@/redux/slices/auth';
import { appData } from '@/redux/slices/appConfig';
import { blobToBuffer } from '@/utils/utils';


const PendingTest = () => {
  const [pendingTest, setPendingTest] = useState<any>(undefined);
  const dispatch = useDispatch();
  const router = useRouter();
  const { participant_id } = useSelector(authToken);
  const { barcode, startTime, endTime, signature, } = useSelector(testData);
  const { first_name, last_name } = useSelector(appData);


  const TEST_UPLOAD = useCallback(async () => {
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
          drugkitname: pendingTest!.kit.kit_name,
          tracking_number: '1234567890',
          shippinglabelURL: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
          scan_barcode_kit_value: '1234567890',
          detect_kit_value: '1234567890',
          signature_screenshot: signature,
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
  }, [barcode, dispatch, endTime, first_name, last_name, participant_id, pendingTest, signature, startTime]);

  const TEST_VID_UPLOAD = useCallback(async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('video', blob, `${pendingTest!.kit.kit_id}.mp4`);

      const buffer = await blobToBuffer(blob);

      dispatch(setUploadStatus(true));

      await TEST_UPLOAD()

      await createPresignedUrl(`pending-${pendingTest!.kit.kit_id}.mp4`).then((response: any) => {
        if (response) {
          const url = response;
          fetch(url, {
            method: 'PUT',
            body: buffer as Buffer,
            headers: { "Content-Length": blob!.size as unknown as string }
          }).then((response) => {
            console.log('s3 upload res-->', response)
            if (response.ok && response.status === 200) {
              deleteBlobFromIndexedDB(pendingTest!.id, participant_id as string);
              localStorage.removeItem('pendingTest');
              dispatch(setUploadStatus(false));
            } else {
              toast.error('Error uploading video');
            }
          }).catch((error) => {
            console.error('S3 Upload Error:', error)
          });
        } else {
          toast.error('Error uploading video');
        }
      }).catch((error: Error) => {
        console.error('Presigned URL Error:', error);
      });
    } catch (error) {
      pendingTest();
      console.error("Upload error:", error);
    }
  }, [TEST_UPLOAD, dispatch, participant_id, pendingTest]);

  const uploadPending = async () => {
    try {
      if (pendingTest === undefined) {
        return;
      };

      const pendingTestCheck = await checkDatabaseAndObjectStore(participant_id as string)

      if (pendingTest.startTime !== undefined && pendingTestCheck) {
        const blob = await retrieveBlobFromIndexedDB(pendingTest.id, participant_id as string);

        // Create FormData and append the Blob
        const formData = new FormData();
        formData.append('video', blob!, 'proof-capture1.mp4');

        dispatch(setUploadStatus(true));

        // Upload to AWS S3
        if (process.env.NODE_ENV !== 'development') {
          dispatch(setUploadStatus(true));
          await TEST_VID_UPLOAD(blob!);
        } else {
          await uploadVideoToS3(formData, `pending-${pendingTest.kit.kit_id}.mp4`).then((response) => {
            if (response && response['$metadata'].httpStatusCode === 200) {
              dispatch(setUploadStatus(false));
              deleteBlobFromIndexedDB(pendingTest.id, participant_id as string);
              localStorage.removeItem('pendingTest');
            } else {
              dispatch(setUploadStatus(undefined));
              toast.error('Error uploading video');
            }
          }).catch((error) => {
            dispatch(setUploadStatus(undefined));
            console.error('S3 Upload Error:', error)
          });
        }

        const url = URL.createObjectURL(blob!);
        dispatch(saveTestClip(url));
        router.push('/test-collection/collection-summary')
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('pendingTest') && pendingTest === undefined) {
      const pendingTestsLocal = localStorage.getItem('pendingTest');
      if (pendingTestsLocal) {
        const decryptedPendingTest = JSON.parse(Crypto.AES.decrypt(pendingTestsLocal, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString(Crypto.enc.Utf8));
        setPendingTest(decryptedPendingTest);
      }
    }

    if (pendingTest !== undefined && pendingTest.startTime !== undefined) {
      dispatch(setStartTime(pendingTest.startTime));
      dispatch(setEndTime(pendingTest.endTime));
    }

  }, [pendingTest, dispatch]);

  return (
    <div className="container">
      <AppHeader title="Pending Test" />
      <div className="pending-test-container">
        {pendingTest !== undefined || null ? (
          <div className="pending-test">
            <Image src={pendingTest.kit.kit_image} alt="proof image" width={5000} height={5000} className="pend-test-img" loading='lazy' />
            <h1 style={{ color: '#24527B' }}>{pendingTest.kit.kit_name}</h1>
            <article className="sum-texts">
              <div className="sum-text">
                <h4>Collection Start:</h4>
                <p>{startTime}</p>
              </div>
              <div className="sum-text">
                <h4>Collection End:</h4>
                <p>{endTime}</p>
              </div>
            </article>
            <Button style={{ padding: '12px', height: '50px' }} classname="blue" onClick={uploadPending}>Upload</Button>
          </div>
        ) : (
          <h4 className="pending-text">No Pending drug test videos.</h4>
        )}
      </div>
      <Menu />
    </div>
  );
};

export default PendingTest;