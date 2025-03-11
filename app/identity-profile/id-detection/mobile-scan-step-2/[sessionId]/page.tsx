"use client";

import { QrSuccessMsg, Scanner } from "@/components";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import DdBarcodeScanner from "@/components/DdBarcodeScanner/DdBarcodeScanner";

const MobileScan = () => {
  const params = usePathname();
  const sessionId = params.split("/").pop();
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [showSuccesMsg, setShowSuccesMsg] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.origin;
      setBaseUrl(url);
    }
  }, []);

  const handleScan = useCallback(
    async (data: string) => {
      try {
        const response = await fetch(
          `${baseUrl}/api/scan-barcode-mobile/submit-scan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data,
              participantId: sessionId,
            }),
          }
        );
        if (!response.ok) {
          toast.error("Failed to send data");
        }
        toast.success("Data sent successfully");
        setShowSuccesMsg(true);
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [baseUrl, sessionId]
  );

  const handleBarcodeData = (data: string) => {
    handleScan(data);
  };

  const handleClose = () => {
    // setShowSuccesMsg(false)
    // setShowSuccesMsg(false)
    setTimeout(() => {
      window.close();
    }, 1000);
  };

  return (
    <div className="id-detection-container">
      {showSuccesMsg && <QrSuccessMsg onClose={handleClose} />}
      {!showSuccesMsg && (
        // <DdBarcodeScanner
        //   show={true}
        //   scanType="id"
        //   barcodeUploaded={false}
        //   recapture={false}
        //   closeModal={() => false}
        //   onBarcodeScan={handleBarcodeData}
        //   qrScan={true}
        // />
        <Scanner
          show={true}
          scanType="id"
          barcodeUploaded={false}
          // step={2}
          // totalSteps={3}
          recapture={false}
          closeModal={() => false}
          onBarcodeScan={handleBarcodeData}
          qrScan={true}
        />
      )}
    </div>
  );
};

export default MobileScan;
