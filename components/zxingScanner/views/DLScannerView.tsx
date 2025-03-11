import { Loader_ } from "@/components";
import Button from "@/components/button";
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";
import React, { RefObject } from "react";
import { TbCapture } from "react-icons/tb";
import Webcam from "react-webcam";

interface BarcodeCaptureProps {
  scanType: string;
  recapture: () => void;
  scannerLoading?: boolean;
  barcode?: string;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  capturedImage?: HTMLImageElement | null;
  handleSaveBarcode: () => void;
  cameraRef: RefObject<Webcam>;
  // handleStartScan: (videoElement: HTMLVideoElement) => void;
}

function DLScannerView({
  scanType,
  recapture,
  barcode = "",
  setBarcode,
  scannerLoading = false,
  capturedImage,
  handleSaveBarcode,
  cameraRef,
}: // handleStartScan,
BarcodeCaptureProps) {
  const isDesktop = useResponsive();
  return (
    <div className="barcode-cap-modal">
      {capturedImage && barcode !== "" && (
        <img
          src={capturedImage?.src}
          alt="Captured"
          style={{
            width: "100%",
            height: isDesktop ? "calc(100% - 80px)" : "100%",
            position: "absolute",
            bottom: 0,
            zIndex: 99,
          }}
        />
      )}

      {barcode !== "" && (
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

      <div
        className="barcode-cap"
        style={{
          //   background: "#000000",
          background: "#F4F7F8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {scannerLoading && <Loader_ />}

        <div
          // className="id-card-frame-guide"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            // height: "100%",
            zIndex: 999,
            position: "absolute",
            padding: "8px",
          }}
        >
          <div className="box">
            <div className="content"></div>
          </div>
        </div>

        {/* <div
          id="data-capture-view"
          style={{
            height: barcode ? "500px" : "auto",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        ></div> */}
        <div style={{ width: "100%" }}>
          {!barcode && (
            <Webcam
              audio={false}
              ref={cameraRef}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{
                facingMode: "environment", // Use back camera on mobile
              }}
            />
          )}
        </div>
      </div>
      {
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
        </div>
      }
    </div>
  );
}

export default DLScannerView;
