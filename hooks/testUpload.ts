import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createPresignedUrl,
  // uploadVideoChunks,
  uploadVideoToS3Bucket,
  uploadVideoWithFetchToS3,
} from "@/app/test-collection/[slug]/action";
import { authToken } from "@/redux/slices/auth";
import {
  saveConfirmationNo,
  setUploadStatus,
  testData,
} from "@/redux/slices/drugTest";
import {
  blobToBase64,
  blobToBuffer,
  convertBlobToBase64,
  getConnectionType,
} from "@/utils/utils";
import { toast } from "react-toastify";
import useGetDeviceInfo from "./useGetDeviceInfo";
import { userIdString } from "@/redux/slices/appConfig";

const storageBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN;
const imagesBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_IMAGES_DOMAIN;
const videosBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_VIDEOS_DOMAIN;

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
    barcodePip2Url,
  } = useSelector(testData);
  const { participant_id } = useSelector(authToken);
  const userID = useSelector(userIdString);
  const { osName, osVersion, deviceModel, deviceType, deviceVendor } =
    useGetDeviceInfo();

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
      const keyFilename = filename.replace(/[\/\(\)\[\]\{\}#&?%=+~`;*^$]/g, "");
      const body = JSON.stringify({
        record_id: keyFilename,
        record: {
          participant_id: participant_id as string,
          url: keyFilename || "",
          photo_url: faceCompare ? `${faceCompare}` : "",
          start_time: startTime,
          end_time: endTime,
          submitted: Date.now().toString(),
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
          shippinglabelurl: shippingLabel ? `${shippingLabel}` : "",
          barcode_url: barcodeKit,
          scan_barcode_kit_value: barcode,
          detect_kit_value: detectKit,

          signature_screenshot: signature ? `${signature}` : "",
          proof_id: proofId.includes(".png") ? proofId : proofId + ".png",

          // face_compare_url: faceCompare ? `${faceCompare}` : "",
          face_compare_url: proofId.includes(".png")
            ? proofId
            : proofId + ".png",
          face_scan1_url: faceScans[0] ? `${faceScans[0]?.url}` : "",
          face_scan2_url: faceScans[1] ? `${faceScans[1]?.url}` : "",
          face_scan3_url: faceScans[2] ? `${faceScans[2]?.url}` : "",
          face_scan1_percentage: faceScans[0]
            ? `${faceScans[0]?.percentage}`
            : "",
          face_scan2_percentage: faceScans[1]
            ? `${faceScans[1]?.percentage}`
            : "",
          face_scan3_percentage: faceScans[2]
            ? `${faceScans[2]?.percentage}`
            : "",
          // image_capture1_url: imageCaptures ? `${imageCaptures[0]!}` : "",
          image_capture1_url: imageCaptures ? `${imageCaptures[0]!}` : "",
          image_capture2_url: imageCaptures ? `${imageCaptures[1]!}` : "",
          passport_photo_url: passport ? `${passport}` : "",
          government_photo_url: governmentID ? `${governmentID}` : "",
          first_name: idDetails.first_name,
          last_name: idDetails.last_name,
          date_of_birth: idDetails.date_of_birth,
          address: idDetails.address,
          city: idDetails.city,
          state: idDetails.state,
          zipcode: idDetails.zipcode,
          bucket: "web app",
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
    userID,
    barcodePip2Url,
  ]);

  const uploader = useCallback(
    async (blob: Blob, pendingTest?: () => void) => {
      try {
        const webmBlob = new Blob([blob], { type: "video/mp4" });
        let success = false;
        const buffer = await blobToBuffer(webmBlob!);
        const keyFilename = filename.replace(
          /[\/\(\)\[\]\{\}#&?%=+~`;*^$]/g,
          ""
        );

        const base64String = await convertBlobToBase64(blob);

        dispatch(setUploadStatus(true));

        await testUpload();
        console.log("Uploading to S3...");

        await createPresignedUrl(keyFilename, "video/mp4")
          .then(async (response: any) => {
            if (response) {
              console.log("Presigned URL:", response);
              const url = response;

              await fetch(url, {
                method: "PUT",
                body: buffer as Buffer,
                headers: {
                  "Content-Length": blob!.size as unknown as string,
                  "Content-Type": "video/mp4",
                },
              })
                .then(async (response) => {
                  console.log("s3 res:", response);
                  if (response.ok && response.status === 200) {
                    setTimeout(() => {
                      dispatch(setUploadStatus(false));
                      success = true;
                    }, 45000);
                  } else {
                    setTimeout(() => {
                      pendingTest?.();
                      toast.error("Error uploading video");
                    }, 45000);
                  }
                })
                .catch((error) => {
                  setTimeout(() => {
                    pendingTest?.();
                    console.error("S3 Upload Error:", error);
                  }, 45000);
                });
            }
          })
          .catch((error) => {
            setTimeout(() => {
              pendingTest?.();
              toast.error("Error uploading video");
              console.error("Presigned URL Error:", error);
            }, 45000);
          });

        return success;
      } catch (error) {
        setTimeout(() => {
          pendingTest?.();
          console.error("Upload error:", error);
        }, 45000);
      }
    },
    [dispatch, testUpload, filename]
  );

  return { uploader, testUpload };
}

export default useTestupload;

//   fetch(
//     `${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/convert-to-mp4`,
//     {
//       method: "POST",
//       headers: {
//         Accept: "*/*",
//         "Accept-Encoding": "gzip, deflate",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
//         "Content-Type": "application/json",
//         Connection: "keep-alive",
//       },
//       body: JSON.stringify({
//         uri: filename,
//       }),
//     }
//   );
