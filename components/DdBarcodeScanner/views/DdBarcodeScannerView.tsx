import { Loader_ } from "@/components";
import Button from "@/components/button";
import useResponsive from "@/hooks/useResponsive";
import Imag from "next/image";
import React, { RefObject, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import Webcam from "react-webcam";
import jsQR from "jsqr";

interface BarcodeCaptureProps {
  scanType: string;
  recapture: () => void;
  scannerLoading?: boolean;
  revealScanDetailsInScanner?: boolean;
  barcode?: string;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  capturedImage?: HTMLImageElement | null;
  handleSaveBarcode: () => void;
  handleSaveManually: (e: React.ChangeEvent<HTMLInputElement>) => void;
  enterManually: boolean;
  setEnterManually: React.Dispatch<React.SetStateAction<boolean>>;
  cameraRef: RefObject<Webcam>;
  onScan(code: string): void;
}

function DdBarcodeScannerView({
  scanType,
  recapture,
  barcode = "",
  setBarcode,
  scannerLoading = false,
  capturedImage,
  handleSaveBarcode,
  handleSaveManually,
  enterManually,
  setEnterManually,
  revealScanDetailsInScanner,
  cameraRef,
  onScan,
}: BarcodeCaptureProps) {
  const isDesktop = useResponsive();

  const handleQRScan = (imageData: ImageData) => {
    if (imageData) {
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      if (qrCode) {
        console.log(qrCode.data);
        onScan(qrCode.data); // Set the result if a QR code is found
      }
    }
  };

  // Function to capture frames from the webcam and process them
  const captureFrame4QR = () => {
    if (cameraRef.current) {
      const videoFrame = cameraRef.current.getScreenshot();
      if (videoFrame) {
        const img = new Image();
        img.src = videoFrame;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, img.width, img.height);
            handleQRScan(imageData);
          }
        };
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(captureFrame4QR, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="barcode-cap-modal">
      {!enterManually && barcode !== "" && revealScanDetailsInScanner && (
        <div className="bc-content">
          <div className="sum-text">
            <h2
              style={{
                color: "#24527b",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {barcode}
            </h2>
            <Button classname="td-right" onClick={handleSaveBarcode}>
              Confirm
            </Button>
          </div>
        </div>
      )}

      {enterManually && revealScanDetailsInScanner && (
        <div
          className="bc-content"
          style={{ backgroundColor: "white", zIndex: 9999 }}
        >
          <div className="sum-text">
            <h4 style={{ color: "#24527b" }}>
              Enter Barcode without spaces{" "}
              <span style={{ color: "red" }}>*</span>
            </h4>
            <Button
              classname="td-right"
              onClick={() => {
                setEnterManually(false);
                handleSaveBarcode();
              }}
              disabled={barcode === "" ? true : false}
            >
              Confirm
            </Button>
          </div>
          <input
            className="bc-input"
            type="text"
            placeholder="Enter Barcode or N/A, if no text is present."
            onChange={handleSaveManually}
          />
        </div>
      )}
      <div className="barcode-cap" style={{ background: "#000000" }}>
        {scannerLoading && <Loader_ />}

        <div
          // className="id-card-frame-guide"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 999,
            position: "absolute",
            padding: "8px",
          }}
        >
          <div>
            <Imag
              style={{ width: "100%", height: "auto" }}
              src="/images/barcode-guide.svg"
              alt="guide Image"
              width={2000}
              height={2000}
            />
          </div>
        </div>

        <div style={{ width: "100%", height: "100%" }}>
          {capturedImage && barcode !== "" ? (
            <img
              src={capturedImage?.src}
              alt="Captured"
              style={{
                width: "100%",
                // height: isDesktop ? "calc(100% - 80px)" : "100%",
                // position: "absolute",
                height: "100%",
                bottom: 0,
                zIndex: 99,
              }}
            />
          ) : (
            <Webcam
              audio={false}
              ref={cameraRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              videoConstraints={{
                facingMode: "environment",
              }}
            />
          )}
        </div>
      </div>
      {!enterManually && (
        <div
          className="barcode-btns"
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {barcode && (
            <Button
              classname="cap-btn"
              onClick={() => {
                setBarcode("");
                recapture();
              }}
              disabled={!barcode}
            >
              <TbCapture /> Rescan
            </Button>
          )}

          {!isDesktop && (
            <Button
              classname="man-btn"
              onClick={() => {
                setBarcode("");
                setEnterManually(true);
              }}
            >
              <FiEdit /> Enter Manually
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default DdBarcodeScannerView;
