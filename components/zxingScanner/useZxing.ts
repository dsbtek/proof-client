import {
  BrowserMultiFormatReader,
  DecodeHintType,
  Result,
} from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

export const useZxing = ({
  hints,
  timeBetweenDecodingAttempts = 300,
  onResult = () => {},
  onError = () => {},
  webcamRef,
  barcodeValidator,
}: {
  hints?: Map<any, any>;
  timeBetweenDecodingAttempts?: number;
  onResult?: (result: string) => void;
  onError?: (error: Error) => void;
  webcamRef: React.RefObject<Webcam | null>;
  barcodeValidator?: (a: string) => boolean;
}) => {
  const readerRef = useRef<BrowserMultiFormatReader | null>(null); // Keep the reader in a ref
  const [scanning, setScanning] = useState(true);

  // Initialize the reader if not yet created
  useEffect(() => {
    if (!readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader(hints);
    }

    return () => {
      // Cleanup the reader when the component is unmounted
      readerRef.current?.reset();
    };
  }, [hints]);

  // Stop scanning
  const stopScan = () => {
    if (readerRef.current) {
      readerRef.current.stopAsyncDecode();
      readerRef.current.stopContinuousDecode();
      //   setScanning(false);
    }
  };

  // Start scanning
  const handleStartScan = (videoElement: HTMLVideoElement) => {
    if (videoElement && scanning && readerRef.current) {
      readerRef.current?.decodeFromVideoContinuously(
        // null,
        videoElement,
        null,
        (result, error) => {
          if (result) {
            const text = result.getText();
            if (barcodeValidator && !barcodeValidator(text)) {
              return;
            }
            stopScan(); // Stop scanning after detecting a barcode
            onResult(text);
          }
          if (error) {
            onError(error);
          }
        }
      );
    }
  };

  return { handleStartScan, stopScan };
};
