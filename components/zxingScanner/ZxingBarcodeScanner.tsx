import React, { RefObject, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import DdBarcodeScannerView from "./views/DdBarcodeScannerView";
import ModalScannerView from "./views/ModalPackageScannerView";
import DLScannerView from "./views/DLScannerView";
import { useDispatch } from "react-redux";
import {
  saveBarcode,
  setBarcodeKit,
  setDetectKit,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import { useZxing } from "./useZxing";
import { usePathname } from "next/navigation";

interface BarcodeCaptureProps {
  show: boolean;
  scanType: string;
  recapture: boolean;
  closeModal(): void;
  onBarcodeScan?(data: string): void;
  isUsedInModal?: boolean;
  manualBtn?: boolean;
  revealScanDetailsInScanner?: boolean;
  barcode?: string;
  setBarcode?: React.Dispatch<React.SetStateAction<string>>;
  captureImageFn?(): void;
  capturedImage?: HTMLImageElement | null;
  setEnterManual?: React.Dispatch<React.SetStateAction<boolean>>;
  qrScan?: boolean;
  close?: boolean;
  barcodeUploaded?: boolean | undefined;
  cameraRef?: RefObject<Webcam | null>;
  startManualCaptureFn?: (timeLimit: number) => Promise<void>;
  manualImageCaptureTimer?: number;
  barcodeValidator?: (a: string) => boolean;
}

const ZxingBarcodeScanner: React.FC<BarcodeCaptureProps> = ({
  show,
  scanType,
  recapture = false,
  closeModal,
  onBarcodeScan,
  isUsedInModal = false,
  manualBtn = true,
  revealScanDetailsInScanner = true,
  captureImageFn,
  capturedImage,
  setEnterManual,
  barcode: barcodeValue,
  setBarcode: setBarcodeValue,
  qrScan,
  close,
  cameraRef,
  startManualCaptureFn,
  manualImageCaptureTimer,
  barcodeValidator,
  // videoStream,
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const [stream, setStream] = useState(null);
  const [scannerLoading, setScannerLoading] = useState<boolean>(false);
  const [enterManually, setEnterManually] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // Get the stream from the webcam and set it on the video element
    if (cameraRef?.current?.stream) {
      const webcamStream = cameraRef.current.stream;
      setStream(webcamStream as any);
    }
  }, [cameraRef]);

  useEffect(() => {
    // If the stream is available, attach it to the <video> element
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, barcode]);

  // Initialize useZxing hook directly inside the component
  const { handleStartScan, stopScan } = useZxing({
    onResult: (result) => {
      setBarcode(result);
      captureImageFn && captureImageFn();
      setBarcode(result);
      setBarcodeValue?.(result);
      if (onBarcodeScan) {
        onBarcodeScan(result);
      }
    },
    onError: (error) => console.log("From scanner:", error),
    webcamRef,
    barcodeValidator,
  });

  const handleSaveBarcode = () => {
    if (enterManually) {
      setEnterManually(false);
    }
    if (scanType === "test") {
      dispatch(saveBarcode(barcode as string));
    }
    if (scanType === "fedex") {
      dispatch(setTrackingNumber(barcode as string));
    }
    if (scanType === "kit") {
      dispatch(setBarcodeKit(barcode as string));
    }
    if (scanType === "detect") {
      dispatch(setDetectKit(barcode as string));
    }
    setEnterManual && setEnterManual(false);
    closeModal();
  };

  const handleSaveManually = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await startManualCaptureFn?.(5);
    const barcodeInput = e.target.value;
    setBarcode(barcodeInput);
    if (scanType === "test") {
      dispatch(saveBarcode(barcodeInput));
    }
    if (scanType === "fedex") {
      dispatch(setTrackingNumber(barcodeInput));
    }
    if (scanType === "kit") {
      dispatch(setBarcodeKit(barcodeInput));
    }
    if (scanType === "detect") {
      dispatch(setDetectKit(barcodeInput));
    }
  };

  // Modify the pathname effect to only stop scanning when actually navigating away
  useEffect(() => {
    if (!show) {
      // Only stop if the scanner isn't meant to be showing
      stopScan();
    }
  }, [pathname, show]);

  // Simplify the scanning effect to reduce unnecessary stops/starts
  useEffect(() => {
    if (show) {
      if (videoRef?.current?.srcObject) {
        handleStartScan(videoRef.current);
      } else if (webcamRef?.current?.video) {
        handleStartScan(webcamRef.current.video);
      }
    }

    return () => {
      if (!show) {
        // Only stop if the scanner isn't meant to be showing
        stopScan();
      }
    };
  }, [show, handleStartScan]); // Remove stopScan from dependencies

  console.log(cameraRef, "cameraRef", videoRef, "videoRef");

  const renderScanner = () => {
    if (!show) return null;

    if (!isUsedInModal) {
      if (scanType === "id") {
        return (
          <DLScannerView
            scanType={scanType}
            recapture={() => null}
            scannerLoading={scannerLoading}
            barcode={barcode}
            setBarcode={setBarcode}
            capturedImage={capturedImage}
            handleSaveBarcode={handleSaveBarcode}
            cameraRef={webcamRef}
          />
        );
      }
      return (
        <DdBarcodeScannerView
          scanType={scanType}
          recapture={() => null}
          scannerLoading={scannerLoading}
          revealScanDetailsInScanner={revealScanDetailsInScanner}
          barcode={barcode}
          setBarcode={setBarcode}
          capturedImage={capturedImage}
          handleSaveBarcode={handleSaveBarcode}
          handleSaveManually={handleSaveManually}
          enterManually={enterManually}
          setEnterManually={setEnterManually}
          onScan={onBarcodeScan as (code: string) => void}
          cameraRef={cameraRef && videoRef}
          webcamRef={cameraRef ? undefined : webcamRef}
        />
      );
    }

    return <ModalScannerView cameraRef={webcamRef} barcode={barcode} />;
  };

  return renderScanner();
};

// Custom comparison function to control when the component re-renders
const arePropsEqual = (
  prevProps: BarcodeCaptureProps,
  nextProps: BarcodeCaptureProps
) => {
  return (
    prevProps.show === nextProps.show &&
    prevProps.scanType === nextProps.scanType &&
    prevProps.barcode === nextProps.barcode &&
    prevProps.isUsedInModal === nextProps.isUsedInModal &&
    prevProps.capturedImage === nextProps.capturedImage &&
    prevProps.qrScan === nextProps.qrScan &&
    prevProps.close === nextProps.close &&
    prevProps.cameraRef === nextProps.cameraRef
  );
};

// Memoize the component using the custom comparison function
// export default ZxingBarcodeScanner;
export default React.memo(ZxingBarcodeScanner, arePropsEqual);
