import Image from "next/image";
import React from "react";

function ModalScanner() {
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
      <div id="data-capture-view" style={{ borderRadius: "20px" }}></div>
    </div>
  );
}

export default ModalScanner;
