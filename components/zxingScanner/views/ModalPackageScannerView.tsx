import Image from "next/image";
import React, { RefObject } from "react";
import Webcam from "react-webcam";

function ModalScannerView({
  cameraRef,
  // handleStartScan,

  barcode,
}: {
  cameraRef: RefObject<Webcam>;
  // handleStartScan: (videoElement: HTMLVideoElement) => void;

  barcode: string;
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
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
          <Image
            style={{ width: "100%", height: "auto" }}
            src="/images/barcode-guide.svg"
            alt="captured Image"
            width={2000}
            height={2000}
          />
        </div>
      </div>
      {/* <div id="data-capture-view" style={{ borderRadius: "20px" }}></div> */}
      <div style={{ width: "100%", height: "100%" }}>
        {!barcode && (
          <Webcam
            audio={false}
            ref={cameraRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "environment", // Use back camera on mobile
            }}
            // onUserMedia={() => {
            //   // Access the actual video element from react-webcam and start scanning
            //   if (cameraRef.current && cameraRef.current.video) {
            //     handleStartScan(cameraRef.current.video); // Pass the actual video element to zxing
            //   }
            // }}
          />
        )}
      </div>
    </div>
  );
}

export default ModalScannerView;
