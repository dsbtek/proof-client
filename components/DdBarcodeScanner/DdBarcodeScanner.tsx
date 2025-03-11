import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import {
  BarcodeInfo,
  BarcodeScannerOperationParams,
  BarcodeScannerWorkerManager,
  ScanModes,
  ScanScales,
  generateDefaultBarcodeScannerParams,
  generateBarcodeScannerDefaultConfig,
} from "@dannadori/barcode-scanner-worker-js";
import { BarcodeScannerDrawer } from "./BarcodeScannerDrawer"; // Import the drawer class
import DdBarcodeScannerView from "./views/DdBarcodeScannerView";
import ModalScannerView from "./views/ModalPackageScannerView";
import DLScannerView from "./views/DLScannerView";
import { useDispatch } from "react-redux";
import {
  saveBarcode,
  setBarcodeKit,
  setDetectKit,
  setIdDetails,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import { parseAamvaData } from "@/utils/utils";

interface ScanResult {
  barcode_data: string;
  format: string;
}
interface BarcodeCaptureProps {
  show: boolean;
  barcodeUploaded?: boolean | undefined;
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
}

const DdBarcodeScanner: React.FC<BarcodeCaptureProps> = ({
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
  setBarcode: setBarcodeValue,
  qrScan,
  close,
}) => {
  const cameraRef = useRef<Webcam | null>(null);
  const managerRef = useRef<BarcodeScannerWorkerManager | null>(null);
  const [manager, setManager] = useState<
    BarcodeScannerWorkerManager | undefined
  >(undefined);
  const initialConfig = generateBarcodeScannerDefaultConfig();
  const initialParams = generateDefaultBarcodeScannerParams();
  const [config, setConfig] = useState(initialConfig);
  const [params, setParams] = useState<BarcodeScannerOperationParams>({
    ...initialParams,
    type: ScanModes.pure_zxing,
  });
  const [scannerLoading, setScannerLoading] = useState<boolean>(false);
  const [enterManually, setEnterManually] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<BarcodeInfo>();
  const [barcode, setBarcode] = useState<string>("");
  const dispatch = useDispatch();

  // Initialize the barcode scanner manager when the config changes
  useEffect(() => {
    const loadModel = async () => {
      setScannerLoading(true);
      //@ts-ignore
      const m = manager ? manager : new BarcodeScannerWorkerManager();
      await m.init(config);
      managerRef.current = m;
      setManager(managerRef.current!);
      setScannerLoading(false);
    };
    loadModel();
  }, [config]);

  const inputSourceElement = useRef<HTMLVideoElement | null>(null);

  // Set the input video element (webcam stream)
  useEffect(() => {
    if (cameraRef.current && cameraRef.current.video) {
      inputSourceElement.current = cameraRef.current.video;
    }
  }, [cameraRef.current]);

  // Drawer for displaying results on canvas
  const drawer = useRef(new BarcodeScannerDrawer()).current;

  const onScan = (code: string) => {
    captureImageFn && captureImageFn();
    setBarcode(code);
    setBarcodeValue?.(code);
    onBarcodeScan && onBarcodeScan(code);
  };

  // Processing loop
  useEffect(() => {
    if (!managerRef.current || !inputSourceElement.current) return;

    let renderRequestId: number;

    const render = async () => {
      const dst = document.getElementById("output") as HTMLCanvasElement; // The canvas to display barcode detection results
      // No need to create an intermediate canvas now since we're passing the video directly

      try {
        if (inputSourceElement.current) {
          // Get barcode predictions from the manager using the video element
          const prediction = await managerRef.current!.predict(
            params,
            inputSourceElement.current
          );

          if (prediction && prediction.length > 0) {
            console.log(prediction, "predictions");
            prediction?.map((value) => {
              if (value.barcode_type !== "") {
                setScanResults(value);
                if (scanType === "id") {
                  if (value.barcode_data?.includes("ANSI")) {
                    const idData: any = parseAamvaData(value.barcode_data);
                    console.log(idData, "data");
                    const idDetails = {
                      first_name: idData["First Name"],
                      last_name: idData["Last Name"],
                      date_of_birth:
                        typeof idData["Date of Birth"] === "number"
                          ? new Date(idData["Date of Birth"])
                          : idData["Date of Birth"],
                      address: idData["Street Address"],
                      city: idData["City"],
                      state: idData["State"],
                      zipcode: idData["Postal Code"],
                    };
                    dispatch(setIdDetails(idDetails));
                    setBarcode(
                      idData["First Name"] +
                        "-" +
                        idData["Last Name"] +
                        "-" +
                        idData["Driver's License Number"]
                    );
                    captureImageFn && captureImageFn();
                  }
                } else {
                  onScan(value.barcode_data);
                }
              }
            });

            // Draw the prediction results on the canvas
            drawer.draw(dst, params, prediction);
          }
        }
      } catch (error) {
        console.log("Error processing barcode:", error);
      }

      renderRequestId = requestAnimationFrame(render); // Continue rendering
    };

    render(); // Start the render loop

    // Clean up the render loop on component unmount
    return () => {
      cancelAnimationFrame(renderRequestId);
    };
  }, [managerRef.current, inputSourceElement.current, config, params]);

  const handleSaveBarcode = () => {
    if (enterManually) {
      setEnterManually(false);
    }
    scanType === "test" && dispatch(saveBarcode(barcode as string));
    scanType === "fedex" && dispatch(setTrackingNumber(barcode as string));
    scanType === "kit" && dispatch(setBarcodeKit(barcode as string));
    scanType === "detect" && dispatch(setDetectKit(barcode as string));
    setEnterManual && setEnterManual(false);
    closeModal();
  };

  const handleSaveManually = (e: React.ChangeEvent<HTMLInputElement>) => {
    const barcodeInput = e.target.value;
    setBarcode(barcodeInput);
    scanType === "test" && dispatch(saveBarcode(barcodeInput));
    scanType === "fedex" && dispatch(setTrackingNumber(barcodeInput));
    scanType === "kit" && dispatch(setBarcodeKit(barcodeInput));
    scanType === "detect" && dispatch(setDetectKit(barcodeInput));
  };

  return (
    show &&
    (!isUsedInModal ? (
      scanType === "id" ? (
        <DLScannerView
          scanType={scanType}
          recapture={() => null}
          scannerLoading={scannerLoading}
          barcode={barcode as string}
          setBarcode={setBarcode}
          capturedImage={capturedImage}
          handleSaveBarcode={handleSaveBarcode}
          cameraRef={cameraRef}
        />
      ) : (
        <DdBarcodeScannerView
          scanType={scanType}
          cameraRef={cameraRef}
          recapture={() => null}
          scannerLoading={scannerLoading}
          revealScanDetailsInScanner={revealScanDetailsInScanner}
          barcode={barcode as string}
          setBarcode={setBarcode}
          capturedImage={capturedImage}
          handleSaveBarcode={handleSaveBarcode}
          handleSaveManually={handleSaveManually}
          enterManually={enterManually}
          setEnterManually={setEnterManually}
          onScan={onScan}
        />
      )
    ) : (
      <ModalScannerView cameraRef={cameraRef} />
    ))
  );
};

export default DdBarcodeScanner;
