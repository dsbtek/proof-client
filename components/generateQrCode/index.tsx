"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { usePolling } from "@/hooks/usePolling";
import { useSelector } from "react-redux";
import {
  selectUserSessionId,
  setExtractedFaceImage,
  setIDFront,
} from "@/redux/slices/appConfig";
import IDCard from "../IDCard";
import { IoCloseCircleOutline } from "react-icons/io5";
import Crypto from "crypto-js";

import {
  setGovernmentID,
  setPassport,
  setProofID,
} from "@/redux/slices/drugTest";
import { uploadImagesToS3 } from "@/app/identity-profile/id-detection/step-1/action";
import { useDispatch } from "react-redux";
import { authToken } from "@/redux/slices/auth";

const MergedComponent = ({ onClose }: { onClose?: () => void }) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<object>({});
  const [idData, setIdData] = useState<object>();
  const [scan, setScan] = useState(false);
  const userSessionId = useSelector(selectUserSessionId);
  const dispatch = useDispatch();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [preCaturedImage, setPreCapturedImage] = useState<string | null>(null);
  const [pId, setPId] = useState<string | null>(null);
  const { participant_id } = useSelector(authToken);

  // Get base URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // Decrypt function
  const decryptData = (
    encryptedData: string,
    secretKey: string | undefined
  ) => {
    const bytes = Crypto.AES.decrypt(encryptedData, secretKey || "");
    return bytes.toString(Crypto.enc.Utf8);
  };

  // Set session ID
  useEffect(() => {
    if (!participant_id) {
      console.error("Participant ID not found");
      return;
    }
    if (participant_id) {
      const decryptedId = decryptData(
        participant_id as string,
        process.env.NEXT_PUBLIC_SECRET_KEY
      );
      setPId(decryptedId);
      setSessionId(decryptedId);
    }
  }, []);

  useEffect(() => {
    const dateNow = Date.now();
    const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;
    if (faceImage) {
      setCapturedImage(capturedImage);
      dispatch(setGovernmentID(idCapture));
      dispatch(setIDFront(capturedImage!));
      // uploadFileToS3(capturedImage!, idCapture);
      uploadImagesToS3(capturedImage!, idCapture);

      // const faceBase64 = `data:image/png;base64,${face[0]}`;
      setFaceImage(faceImage);
      dispatch(setExtractedFaceImage(faceImage));
      const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
      const proofId = idCapture.split(".")[0];
      dispatch(setPassport(passportCapture));
      dispatch(setProofID(proofId));
      // uploadFileToS3(faceImage, passportCapture);
      uploadImagesToS3(faceImage, passportCapture);
    }
  }, [participant_id, dispatch, capturedImage, faceImage]);

  // Fetch data with polling
  const fetchData = async () => {
    setLoading(true);
    try {
      if (scan) {
        return;
      }
      const response = await fetch(
        `/api/scan-barcode-mobile/check-scan?participantId=${participant_id}`
      );
      if (!response.ok) {
        console.error("Error fetching data:", await response.text());
        setData({});
        return;
      }
      const result = await response.json();
      // const parsedValue = JSON.parse(result?.value);
      const capturedImage = result?.value.includes("capturedImage");
      if (capturedImage) {
        const dateNow = Date.now();
        const idCapture = `${participant_id}-IDCapture-${dateNow}.png`;
        setCapturedImage(result.value.capturedImage);
        dispatch(setGovernmentID(idCapture));
        dispatch(setIDFront(result.value.capturedImage!));
        // uploadFileToS3(result.value.capturedImage!, idCapture);
        uploadImagesToS3(result.value.capturedImage!, idCapture);

        // const faceBase64 = `data:image/png;base64,${face[0]}`;
        setFaceImage(result.value.faceImage);
        dispatch(setExtractedFaceImage(result.value.faceImage));
        const passportCapture = `${participant_id}-PassportCapture-${dateNow}.png`;
        const proofId = idCapture.split(".")[0];
        dispatch(setPassport(passportCapture));
        dispatch(setProofID(proofId));
        // uploadFileToS3(result.value.faceImage, passportCapture);
        uploadImagesToS3(result.value.faceImage, passportCapture);
      } else {
        setData(JSON.parse(result.value));
        setScan(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      // Clean up the id from redis after successfull scan
      await fetch(
        `/api/scan-barcode-mobile/clear-id?participantId=${participant_id}`
      );
    }
  };

  usePolling(fetchData, 5000);

  // Update ID data
  useEffect(() => {
    if (scan) {
      setIdData(data);
    }
  }, [data, scan]);

  const qrUrl = onClose
    ? `${baseUrl}/identity-profile/id-detection/mobile-scan-step-2/${participant_id}`
    : `${baseUrl}/identity-profile/id-detection/mobile-scan-step-1/${participant_id}`;

  return (
    <div
      style={{
        height: onClose ? "100vh" : "100%",
        width: onClose ? "100vw" : "100%",
        zIndex: onClose ? 1000 : 10,
        position: onClose ? "absolute" : "static",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: onClose ? "rgba(128, 128, 128, 0.9)" : "transparent",
      }}
    >
      {participant_id && !scan && (
        <div
          className="wrap-qr"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "360px",
            height: "390px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px",
            zIndex: onClose ? 1000 : 20,
          }}
        >
          {onClose && (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                marginBottom: "10px",
                marginRight: "15px",
              }}
              onClick={onClose}
            >
              <IoCloseCircleOutline size={24} />
            </div>
          )}
          {typeof window !== "undefined" && (
            <QRCodeSVG value={qrUrl} size={256} />
          )}
          <h2
            style={{
              color: "#4E555D",
              fontSize: "16px",
              fontWeight: 400,
              marginTop: "16px",
            }}
          >
            Scan with your mobile device
          </h2>
        </div>
      )}
      {scan && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50px",
            width: "100%",
          }}
        >
          <IDCard idDetails={idData} />
        </div>
      )}
    </div>
  );
};

export default MergedComponent;
