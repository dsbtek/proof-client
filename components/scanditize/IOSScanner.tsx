"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import { useDispatch } from "react-redux";
import "../modals/modal.css";
import Button from "../button";
import Loader from "../loaders/loader";
import {
  saveBarcode,
  setBarcodeKit,
  setDetectKit,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import { toast } from "react-toastify";
import useResponsive from "@/hooks/useResponsive";

interface BarcodeCaptureProps {
  show: boolean;
  barcodeUploaded: boolean | undefined;
  step?: number;
  totalSteps?: number;
  scanType: string;
  recapture(): void;
  closeModal(): void;
  videoRef: HTMLVideoElement;
  onClickCapture: () => void;
  onClickReCapture: () => void;
}

function IOSScanner({
  show,
  barcodeUploaded,
  step,
  totalSteps,
  scanType,
  recapture,
  closeModal,
  videoRef,
  onClickCapture,
  onClickReCapture,
}: BarcodeCaptureProps) {
  const [enterBarcode, setEnterBarcode] = useState(false);
  const [scannerLoad, setScannerLoad] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcode, setBarcode] = useState<string | Record<string, any>>("");

  const [hasCaptured, setHasCaptured] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isDesktop = useResponsive();

  const handleSaveBarcode = () => {
    if (enterBarcode) {
      setEnterBarcode(false);
    }
    scanType === "test" && dispatch(saveBarcode(barcode as string));
    scanType === "fedex" && dispatch(setTrackingNumber(barcode as string));
    scanType === "kit" && dispatch(setBarcodeKit(barcode as string));
    scanType === "detect" && dispatch(setDetectKit(barcode as string));
    closeModal();
  };

  const barcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const barcodeInput = e.target.value;
    setBarcodeValue(barcodeInput);
    scanType === "test" && dispatch(saveBarcode(barcodeInput));
    scanType === "fedex" && dispatch(setTrackingNumber(barcodeInput));
    scanType === "kit" && dispatch(setBarcodeKit(barcodeInput));
    scanType === "detect" && dispatch(setDetectKit(barcodeInput));
  };

  const runScanner = useCallback(async () => {
    setScannerLoad(false);
  }, []);

  useEffect(() => {
    runScanner().catch((error) => {
      console.error("Scandit Error:", error);
      toast.error(error);
    });
  }, [runScanner, show]);

  return (
    show && (
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          bottom: "0px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "fit-content!important",
          backgroundColor: "#FFFFFF",
          padding: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            width: "100%",
            // padding: "12px",
            // position: "absolute",
            // bottom: "90px",
            gap: "16px",
            backgroundColor: "#FFFFFF",
          }}
        >
          {!enterBarcode ? (
            <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
              <FiEdit /> Enter Manually
            </Button>
          ) : hasCaptured ? (
            <Button
              classname="cap-btn"
              onClick={() => {
                setHasCaptured(false);
                // onClickCapture(canvasRef, setImageSrc);
                onClickReCapture();
              }}
            >
              <TbCapture /> Recapture
            </Button>
          ) : (
            <Button
              classname="cap-btn"
              onClick={() => {
                setHasCaptured(true);
                // onClickCapture(canvasRef, setImageSrc);
                onClickCapture();
              }}
            >
              <TbCapture />
              Capture
            </Button>
          )}
        </div>

        {enterBarcode && (
          <div className="bc-content">
            <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
            <div className="sum-text">
              <h4 style={{ color: "#24527b" }}>
                Enter Barcode without spaces{" "}
                <span style={{ color: "red" }}>*</span>
              </h4>
              <Button
                classname="td-right"
                onClick={() => {
                  handleSaveBarcode();
                  onClickReCapture();
                }}
                disabled={barcodeValue === "" || !hasCaptured ? true : false}
              >
                Confirm
              </Button>
            </div>
            <input
              className="bc-input"
              type="text"
              placeholder="Enter Barcode or N/A, if no text is present."
              onChange={barcodeInput}
            />
          </div>
        )}
      </div>
    )
  );
}

const IScannner = dynamic(() => Promise.resolve(IOSScanner), {
  loading: () => <Loader />,
  ssr: false,
});

export default IScannner;

// <div
//         // className="barcode-cap-modal"
//         style={{
//           position: "absolute",
//           boxSizing: "border-box",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "100%",
//           height: "fit-content!important",
//           backgroundColor: "#FFFFFF",
//           paddingTop: "8px",
//         }}
//       >
//         {barcodeUploaded && !enterBarcode && barcode === "" && !isDesktop && (
//           <div className="bc-content" style={{ backgroundColor: "#FFFFFF" }}>
//             {scanType === "id" && step && totalSteps && (
//               <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//             )}

//           </div>
//         )}

//         {enterBarcode && (
//           <div className="bc-content">
//             <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//             <div className="sum-text">
//               <h4 style={{ color: "#24527b" }}>
//                 Enter Barcode without spaces{" "}
//                 <span style={{ color: "red" }}>*</span>
//               </h4>
//               <Button
//                 classname="td-right"
//                 onClick={handleSaveBarcode}
//                 disabled={barcodeValue === "" || !hasCaptured ? true : false}
//               >
//                 Confirm
//               </Button>
//             </div>
//             <input
//               className="bc-input"
//               type="text"
//               placeholder="Enter Barcode or N/A, if no text is present."
//               onChange={barcodeInput}
//             />
//           </div>
//         )}

//         {!enterBarcode ? (
//           <div
//             className="barcode-btns"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",

//               justifyContent: "center",
//               alignContent: "center",
//               width: "100%",
//               padding: "12px",
//               position: "absolute",
//               bottom: "90px",
//               gap: "16px",
//               backgroundColor: "#FFFFFF",
//             }}
//           >

//             {scanType !== "id" && (
//               <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
//                 <FiEdit /> Enter Manually
//               </Button>
//             )}
//           </div>
//         ) : (
//           <div
//             className="barcode-btns"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               background: "transparent",
//               justifyContent: "center",
//               alignContent: "center",
//               width: "100%",
//               padding: "12px",
//               position: "absolute",
//               bottom: "90px",
//               gap: "16px",
//               backgroundColor: "#FFFFFF",
//             }}
//           >
//             <Button
//               classname="cap-btn"
//               onClick={() => {
//                 setHasCaptured(true);
//                 onClickCapture(canvasRef, setImageSrc);
//               }}
//             >
//               <TbCapture /> Capture
//             </Button>
//           </div>
//         )}
//       </div>
