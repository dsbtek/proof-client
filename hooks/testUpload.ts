import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createPresignedUrl } from "@/app/test-collection/[slug]/action";
import { authToken } from "@/redux/slices/auth";
import {
  saveConfirmationNo,
  setUploadStatus,
  testData,
} from "@/redux/slices/drugTest";
import { blobToBuffer, getConnectionType } from "@/utils/utils";
import { toast } from "react-toastify";
import useGetDeviceInfo from "./useGetDeviceInfo";

const storageBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN;

function useTestupload() {
  const dispatch = useDispatch();
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
  const { participant_id } = useSelector(authToken);
  const { osName, osVersion, deviceModel, deviceType, deviceVendor } =
    useGetDeviceInfo();

  // const testUpload = useCallback(async () => {
  //     try {
  //         const connectionType = getConnectionType();
  //         console.log("Connection Type:", connectionType, osName, osVersion, deviceModel, deviceType, deviceVendor);
  //         const response = await fetch("/api/test-upload", {
  //             method: "POST",
  //             headers: {
  //                 participant_id: participant_id as string,
  //                 url: filename ? `${storageBucket}/${filename}` : '',
  //                 photo_url: '',
  //                 start_time: startTime,
  //                 end_time: endTime,
  //                 submitted: '1706033912',
  //                 barcode_string: barcode,
  //                 internet_connection: connectionType,
  //                 app_version: 'web-2.7.0',
  //                 os_version: `${osName}-${osVersion}`,
  //                 phone_model: `${deviceModel}`,
  //                 device_name: `${deviceVendor}-${deviceType}`,
  //                 device_storage: storage,
  //                 look_away_time: lookAway,
  //                 hand_out_of_frame: handsOut,
  //                 drugkitname: testingKit.kit_name,
  //                 tracking_number: trackingNumber,
  //                 shippinglabelURL: shippingLabel ? `${storageBucket}/${shippingLabel}` : '',
  //                 scan_barcode_kit_value: barcodeKit,
  //                 detect_kit_value: detectKit,
  //                 signature_screenshot: signature ? `${storageBucket}/${signature}` : '',
  //                 proof_id: proofId,
  //                 face_compare_url: faceCompare ? `${storageBucket}/${faceCompare}` : '',
  //                 face_scan1_url: faceScans[0] ? `${storageBucket}/${faceScans[0]?.url}` : '',
  //                 face_scan2_url: faceScans[1] ? `${storageBucket}/${faceScans[1]?.url}` : '',
  //                 face_scan3_url: faceScans[2] ? `${storageBucket}/${faceScans[2]?.url}` : '',
  //                 face_scan1_percentage: faceScans[0] ? `${faceScans[0]?.percentage}` : '',
  //                 face_scan2_percentage: faceScans[1] ? `${faceScans[1]?.percentage}` : '',
  //                 face_scan3_percentage: faceScans[2] ? `${faceScans[2]?.percentage}` : '',
  //                 image_capture1_url: imageCaptures ? `${storageBucket}/${imageCaptures[0]!}` : '',
  //                 image_capture2_url: imageCaptures ? `${storageBucket}/${imageCaptures[1]!}` : '',
  //                 passport_photo_url: passport ? `${storageBucket}/${passport}` : '',
  //                 government_photo_url: governmentID ? `${storageBucket}/${governmentID}` : '',
  //                 first_name: idDetails.first_name,
  //                 last_name: idDetails.last_name,
  //                 date_of_birth: idDetails.date_of_birth,
  //                 address: idDetails.address,
  //                 city: idDetails.city,
  //                 state: idDetails.state,
  //                 zipcode: idDetails.zipcode,
  //             },
  //         });
  //         const data = await response.json();
  //         if (data.data.statusCode === 200) {
  //             console.log(data.data);
  //             dispatch(saveConfirmationNo(data.data.confirmationNum));
  //             return data.data;
  //         } else {
  //             console.error(data.data);
  //         }
  //     } catch (error) {
  //         console.error("Self Drug Test Upload error:", error);
  //     }
  // }, [barcode, barcodeKit, detectKit, deviceModel, deviceType, deviceVendor, dispatch, endTime, faceCompare, faceScans, filename, governmentID, handsOut, idDetails, imageCaptures, lookAway, osName, osVersion, participant_id, passport, proofId, shippingLabel, signature, startTime, storage, testingKit.kit_name, trackingNumber]);

  const testUpload = useCallback(async () => {
    try {
      const connectionType = getConnectionType();
      console.log(
        "Connection Type:",
        connectionType,
        osName,
        osVersion,
        deviceModel,
        deviceType,
        deviceVendor
      );
      const body = JSON.stringify({
        record_id: filename,
        record: {
          participant_id: participant_id as string,
          url: filename ? `${storageBucket}/${filename}` : "",
          photo_url: "",
          start_time: startTime,
          end_time: endTime,
          submitted: "1706033912",
          barcode_string: barcode,
          internet_connection: connectionType,
          app_version: "web-2.7.0",
          os_version: `${osName}-${osVersion}`,
          phone_model: `${deviceModel}`,
          device_name: `${deviceVendor}-${deviceType}`,
          device_storage: storage,
          look_away_time: lookAway,
          hand_out_of_frame: handsOut,
          drugkitname: testingKit.kit_name,
          tracking_number: trackingNumber,
          shippinglabelurl: shippingLabel
            ? `${storageBucket}/${shippingLabel}`
            : "",
          scan_barcode_kit_value: barcodeKit,
          detect_kit_value: detectKit,
          signature_screenshot: signature
            ? `${storageBucket}/${signature}`
            : "",
          proof_id: proofId,
          face_compare_url: faceCompare
            ? `${storageBucket}/${faceCompare}`
            : "",
          face_scan1_url: faceScans[0]
            ? `${storageBucket}/${faceScans[0]?.url}`
            : "",
          face_scan2_url: faceScans[1]
            ? `${storageBucket}/${faceScans[1]?.url}`
            : "",
          face_scan3_url: faceScans[2]
            ? `${storageBucket}/${faceScans[2]?.url}`
            : "",
          face_scan1_percentage: faceScans[0]
            ? `${faceScans[0]?.percentage}`
            : "",
          face_scan2_percentage: faceScans[1]
            ? `${faceScans[1]?.percentage}`
            : "",
          face_scan3_percentage: faceScans[2]
            ? `${faceScans[2]?.percentage}`
            : "",
          image_capture1_url: imageCaptures
            ? `${storageBucket}/${imageCaptures[0]!}`
            : "",
          image_capture2_url: imageCaptures
            ? `${storageBucket}/${imageCaptures[1]!}`
            : "",
          passport_photo_url: passport ? `${storageBucket}/${passport}` : "",
          government_photo_url: governmentID
            ? `${storageBucket}/${governmentID}`
            : "",
          first_name: idDetails.first_name,
          last_name: idDetails.last_name,
          date_of_birth: idDetails.date_of_birth,
          address: idDetails.address,
          city: idDetails.city,
          state: idDetails.state,
          zipcode: idDetails.zipcode,
        },
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/send-results`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
            "Content-Type": "application/json",
            Connection: "keep-alive",
          },
          body: body,
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        console.log(data);
        dispatch(saveConfirmationNo(`${Date.now()}`));
        return data;
      }
    } catch (error) {
      console.error("Self Drug Test Upload error:", error);
    }
  }, [
    barcode,
    barcodeKit,
    detectKit,
    deviceModel,
    deviceType,
    deviceVendor,
    dispatch,
    endTime,
    faceCompare,
    faceScans,
    filename,
    governmentID,
    handsOut,
    idDetails,
    imageCaptures,
    lookAway,
    osName,
    osVersion,
    participant_id,
    passport,
    proofId,
    shippingLabel,
    signature,
    startTime,
    storage,
    testingKit.kit_name,
    trackingNumber,
  ]);

  const uploader = useCallback(
    async (blob: Blob, pendingTest?: () => void) => {
      try {
        const webmBlob = new Blob([blob], { type: "video/mp4" });
        let success = false;
        const buffer = await blobToBuffer(webmBlob!);

        dispatch(setUploadStatus(true));

        await testUpload();

        await createPresignedUrl(filename)
          .then(async (response: any) => {
            if (response) {
              const url = response;
              await fetch(url, {
                method: "PUT",
                body: buffer as Buffer,
                headers: { "Content-Length": blob!.size as unknown as string },
              })
                .then(async (response) => {
                  console.log("s3 res:", response);
                  if (response.ok && response.status === 200) {
                    dispatch(setUploadStatus(false));
                    fetch(
                      `${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/convert-to-mp4`,
                      {
                        method: "POST",
                        headers: {
                          Accept: "*/*",
                          "Accept-Encoding": "gzip, deflate",
                          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                          "Content-Type": "application/json",
                          Connection: "keep-alive",
                        },
                        body: JSON.stringify({
                          uri: filename,
                        }),
                      }
                    );
                    success = true;
                  } else {
                    pendingTest?.();
                    toast.error("Error uploading video");
                  }
                })
                .catch((error) => {
                  pendingTest?.();
                  console.error("S3 Upload Error:", error);
                });
            }
          })
          .catch((error) => {
            pendingTest?.();
            toast.error("Error creating Presigned URL");
            console.error("Presigned URL Error:", error);
          });

        return success;
      } catch (error) {
        pendingTest?.();
        console.error("Upload error:", error);
      }
    },
    [dispatch, testUpload, filename]
  );

  return { uploader, testUpload };
}

export default useTestupload;
