"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Crypto from "crypto-js";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";

import {
  Menu,
  AppHeader,
  Button,
  Loader,
  DinamicMenuLayout,
} from "@/components";
import { uploadVideoToS3 } from "../test-collection/[slug]/action";
import {
  saveTestClip,
  setEndTime,
  setStartTime,
  setUploadStatus,
  testData,
} from "@/redux/slices/drugTest";
import {
  retrieveBlobFromIndexedDB,
  checkDatabaseAndObjectStore,
  deleteBlobFromIndexedDB,
} from "@/utils/indexedDB";
import { authToken } from "@/redux/slices/auth";
import useTestupload from "@/hooks/testUpload";
import dynamic from "next/dynamic";

const PendingTest = () => {
  const [pendingTest, setPendingTest] = useState<any>(undefined);
  const [uploading, setUploading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { participant_id } = useSelector(authToken);
  const { startTime, endTime } = useSelector(testData);
  const { uploader, testUpload } = useTestupload();
  const device = useGetDeviceInfo();

  const uploadPending = async () => {
    try {
      setUploading(true);
      if (pendingTest === undefined) {
        return;
      }

      const pendingTestCheck = await checkDatabaseAndObjectStore(
        participant_id as string
      );

      if (pendingTest.startTime !== undefined && pendingTestCheck) {
        const blob = await retrieveBlobFromIndexedDB(
          pendingTest.id,
          participant_id as string
        );

        // Upload to AWS S3
        if (process.env.NODE_ENV !== "development") {
          dispatch(setUploadStatus(true));

          const failedUpload = () => {
            dispatch(setUploadStatus(undefined));
          };

          await uploader(blob!, failedUpload)
            .then((response) => {
              console.log(response);
              if (response) {
                setUploading(false);
                dispatch(setUploadStatus(false));
                deleteBlobFromIndexedDB(
                  pendingTest.id,
                  participant_id as string
                );
                localStorage.removeItem("pendingTest");
              } else {
                dispatch(setUploadStatus(undefined));
                toast.error("Error uploading video");
              }
            })
            .catch((error) => {
              dispatch(setUploadStatus(undefined));
              console.error("Pending Test UploadError:", error);
            });
        } else {
          // Create FormData and append the Blob
          const formData = new FormData();
          formData.append("video", blob!, "proof-capture1.mp4");

          dispatch(setUploadStatus(true));
          await testUpload();

          await uploadVideoToS3(
            formData,
            `pending-${pendingTest.kit.kit_id}.mp4`
          )
            .then((response) => {
              if (response && response["$metadata"].httpStatusCode === 200) {
                dispatch(setUploadStatus(false));
                deleteBlobFromIndexedDB(
                  pendingTest.id,
                  participant_id as string
                );
                localStorage.removeItem("pendingTest");
              } else {
                dispatch(setUploadStatus(undefined));
                toast.error("Error uploading video");
              }
            })
            .catch((error) => {
              dispatch(setUploadStatus(undefined));
              console.error("PT S3 Upload Error:", error);
            });
        }

        const url = URL.createObjectURL(blob!);
        dispatch(saveTestClip(url));
        router.push("/test-collection/collection-summary");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const deletePending = async () => {
    try {
      deleteBlobFromIndexedDB(pendingTest.id, participant_id as string);
      localStorage.removeItem("pendingTest");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("pendingTest") &&
      pendingTest === undefined
    ) {
      const pendingTestsLocal = localStorage.getItem("pendingTest");
      if (pendingTestsLocal) {
        const decryptedPendingTest = JSON.parse(
          Crypto.AES.decrypt(
            pendingTestsLocal,
            process.env.NEXT_PUBLIC_SECRET_KEY as string
          ).toString(Crypto.enc.Utf8)
        );
        setPendingTest(decryptedPendingTest);
      }
    }

    if (pendingTest !== undefined && pendingTest.startTime !== undefined) {
      dispatch(setStartTime(pendingTest.startTime));
      dispatch(setEndTime(pendingTest.endTime));
    }
  }, [pendingTest, dispatch]);

  return (
    <DinamicMenuLayout>
      <div className="tutorial-container">
        {uploading && <Loader />}

        {device?.screenWidth > 700 ? (
          <div className="what-new-dxtp-header">
            <h1>Pending Test</h1>
          </div>
        ) : (
          <AppHeader title="Pending Test" hasMute={false} />
        )}
        <div className="pending-test-container">
          {pendingTest !== undefined || null ? (
            <div className="pending-test">
              <Image
                src={pendingTest.kit.kit_image}
                alt="proof image"
                width={5000}
                height={5000}
                className="pend-test-img"
                loading="lazy"
              />
              <h1 style={{ color: "#24527B" }}>{pendingTest.kit.kit_name}</h1>
              <article className="sum-texts">
                <div className="sum-text">
                  <h4>Collection Start:</h4>
                  <p>{pendingTest.startTime}</p>
                </div>
                <div className="sum-text">
                  <h4>Collection End:</h4>
                  <p>{pendingTest.endTime}</p>
                </div>
              </article>
              <Button
                style={{ padding: "12px", height: "50px" }}
                classname="blue"
                onClick={uploadPending}
              >
                Upload
              </Button>
              <Button
                style={{ padding: "12px", height: "50px", color: "#24527B" }}
                classname="white"
                onClick={deletePending}
              >
                Delete
              </Button>
            </div>
          ) : (
            <h4 className="pending-text">No Pending drug test videos.</h4>
          )}
        </div>
      </div>
    </DinamicMenuLayout>
  );
};

// export default PendingTest;
export default dynamic(() => Promise.resolve(PendingTest), {
  ssr: false,
});
