"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import { useDispatch } from "react-redux";
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";
import Webcam from "react-webcam";

import "../modals/modal.css";
import Loader from "../loaders/loader";
import {
  saveBarcode,
  setBarcodeKit,
  setDetectKit,
  setIdDetails,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import { toast } from "react-toastify";
import { parseAamvaData } from "@/utils/utils";
import { Loader_ } from "..";
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";
import ModalScanner from "./views/ModalPackageScanner";
import DLScanner from "./views/DLScanner";
import BarcodeScanner from "./views/BarcodeScanner";

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

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
  manualImageCaptureTimer?: number;
  startManualCaptureFn?: (timeLimit: number) => Promise<void>;
}

function ScanditScannner({
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
  qrScan,
  close,
  manualImageCaptureTimer,
  startManualCaptureFn,
}: BarcodeCaptureProps) {
  const [enterBarcode, setEnterBarcode] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [canStartScan, setCanStartScan] = useState(false);

  const [barcode, setBarcode] = useState<string | Record<string, any>>("");
  const contextRef = useRef<SDCCore.DataCaptureContext | null>(null);
  const settingsRef = useRef<SDCBarcode.BarcodeCaptureSettings | null>(null);
  const cameraRef = useRef<SDCCore.Camera | null>(null);
  const barcodeCaptureContext = useRef<SDCBarcode.BarcodeCapture | null>(null);
  const viewRef = useRef<SDCCore.DataCaptureView | null>(null);
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
    setEnterManual && setEnterManual(false);
    closeModal();
  };

  const handleSaveManually = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await startManualCaptureFn?.(5);
    const barcodeInput = e.target.value;
    setBarcode(barcodeInput);
    scanType === "test" && dispatch(saveBarcode(barcodeInput));
    scanType === "fedex" && dispatch(setTrackingNumber(barcodeInput));
    scanType === "kit" && dispatch(setBarcodeKit(barcodeInput));
    scanType === "detect" && dispatch(setDetectKit(barcodeInput));
  };

  const runScanner = useCallback(async () => {
    setScannerLoading(true);

    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      contextRef.current!,
      settingsRef.current! as SDCBarcode.BarcodeCaptureSettings
    );

    await barcodeCapture.setEnabled(false);
    // to-do
    barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        await barcodeCapture.setEnabled(false);
        const barcode = session.newlyRecognizedBarcode;
        const symbology = new SDCBarcode.SymbologyDescription(
          barcode!.symbology
        );

        if (scanType === "id" && symbology.readableName === "PDF417") {
          const idData: any = parseAamvaData(barcode!.data);
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
        } else {
          setBarcode(barcode!.data!);
          captureImageFn && captureImageFn();
        }

        if (onBarcodeScan) {
          onBarcodeScan(barcode!.data!);
          captureImageFn && captureImageFn();
        }

        await barcodeCapture.setEnabled(false);
        await cameraRef.current?.switchToDesiredState(
          SDCCore.FrameSourceState.Off
        );
      },
    });

    // create view by passing in context and attach element
    const view = await SDCCore.DataCaptureView.forContext(contextRef.current);
    view.connectToElement(
      document?.getElementById("data-capture-view") as HTMLElement
    );
    view.addControl(new SDCCore.CameraSwitchControl());
    if (view) {
      viewRef.current = view;
    }

    // baarcode capture overlay
    const barcodeCaptureOverlay =
      await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        barcodeCapture,
        view,
        SDCBarcode.BarcodeCaptureOverlayStyle.Frame
      );
    const viewfinder = new SDCCore.RectangularViewfinder(
      SDCCore.RectangularViewfinderStyle.Rounded,
      SDCCore.RectangularViewfinderLineStyle.Light
    );
    await barcodeCaptureOverlay.setViewfinder(viewfinder);
    // on camera and enable capture
    await cameraRef.current?.switchToDesiredState(SDCCore.FrameSourceState.On);
    await barcodeCapture.setEnabled(true);

    setScannerLoading(false);
  }, [dispatch, onBarcodeScan, scanType]);

  // initializations
  useEffect(() => {
    (async () => {
      console.log("we tried rendering here");
      await SDCCore.configure({
        licenseKey: licenseKey as string,
        libraryLocation:
          "https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/",
        moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
      });

      const context = await SDCCore.DataCaptureContext.create();
      if (context) {
        contextRef.current = context;
      }

      // Set up the camera with front-facing as the default
      const camera = qrScan
        ? SDCCore.Camera.atPosition(SDCCore.CameraPosition.WorldFacing)
        : SDCCore.Camera.atPosition(SDCCore.CameraPosition.UserFacing);
      await context.setFrameSource(camera);

      if (camera) {
        cameraRef.current = camera;
      }

      const settings = new SDCBarcode.BarcodeCaptureSettings();
      console.log(settings, "settingss over here...");

      const generalScanner = [
        SDCBarcode.Symbology.Code128,
        SDCBarcode.Symbology.Aztec,
        SDCBarcode.Symbology.PDF417,
        SDCBarcode.Symbology.Code39,
        SDCBarcode.Symbology.Code32,
        SDCBarcode.Symbology.Lapa4SC,
        SDCBarcode.Symbology.USPSIntelligentMail,
        SDCBarcode.Symbology.QR,
        SDCBarcode.Symbology.MicroQR,
        SDCBarcode.Symbology.EAN8,
        SDCBarcode.Symbology.UPCE,
        SDCBarcode.Symbology.EAN13UPCA,
        SDCBarcode.Symbology.Code11,
        SDCBarcode.Symbology.Code25,
        SDCBarcode.Symbology.Code93,
        SDCBarcode.Symbology.Codabar,
        SDCBarcode.Symbology.InterleavedTwoOfFive,
        SDCBarcode.Symbology.MSIPlessey,
        SDCBarcode.Symbology.MaxiCode,
        SDCBarcode.Symbology.DataMatrix,
        SDCBarcode.Symbology.DotCode,
        SDCBarcode.Symbology.RM4SCC,
        SDCBarcode.Symbology.KIX,
        SDCBarcode.Symbology.GS1Databar,
        SDCBarcode.Symbology.GS1DatabarExpanded,
        SDCBarcode.Symbology.GS1DatabarLimited,
        SDCBarcode.Symbology.MicroPDF417,
        SDCBarcode.Symbology.IATATwoOfFive,
        SDCBarcode.Symbology.MatrixTwoOfFive,
      ];

      settings.enableSymbologies(
        scanType === "id"
          ? [SDCBarcode.Symbology.PDF417]
          : scanType === "fedex"
          ? [SDCBarcode.Symbology.Code128]
          : generalScanner
      );

      console.log(settings, "settings");
      if (settings) {
        settingsRef.current = settings;
      }
      console.log(contextRef, "from here context");
      console.log(settingsRef, "from here settings");
      setCanStartScan(true);
    })();
  }, [scanType, qrScan]);

  // start scanning
  useEffect(() => {
    if (canStartScan) {
      runScanner().catch((error) => {
        console.error("Scandit Error:", error);
        toast.error(error);
      });
    }
  }, [runScanner, show, canStartScan]);

  // restart run scanner
  const recaptureFn = () => {
    runScanner().catch((error) => {
      console.error("Scandit Error:", error);
      toast.error(error);
    });
  };

  // restart run scanner
  useEffect(() => {
    if (recapture) {
      runScanner().catch((error) => {
        console.error("Scandit Error:", error);
        toast.error(error);
      });
    }
  }, [recapture, runScanner]);

  //use effect to close camera, clear context and detach from view
  useEffect(() => {
    if (close) {
      (async () =>
        await cameraRef.current?.switchToDesiredState(
          SDCCore.FrameSourceState.Off
        ))();
      viewRef.current?.detachFromElement();
      viewRef.current?.setContext(null);
      cameraRef.current = null;
      contextRef.current = null;
      settingsRef.current = null;
    }
  }, [close]);
  return (
    show &&
    (!isUsedInModal ? (
      scanType === "id" ? (
        <DLScanner
          scanType={scanType}
          recapture={recaptureFn}
          scannerLoading={scannerLoading}
          barcode={barcode as string}
          setBarcode={setBarcode}
          capturedImage={capturedImage}
          handleSaveBarcode={handleSaveBarcode}
        />
      ) : (
        <BarcodeScanner
          scanType={scanType}
          recapture={recaptureFn}
          scannerLoading={scannerLoading}
          revealScanDetailsInScanner={revealScanDetailsInScanner}
          barcode={barcode as string}
          setBarcode={setBarcode}
          capturedImage={capturedImage}
          handleSaveBarcode={handleSaveBarcode}
          handleSaveManually={handleSaveManually}
          enterManually={enterBarcode}
          setEnterManually={setEnterBarcode}
        />
      )
    ) : (
      <ModalScanner />
    ))
  );
}

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
    prevProps.manualImageCaptureTimer === nextProps.manualImageCaptureTimer
  );
};

const ScanditScannnerMemoized = React.memo(ScanditScannner, arePropsEqual);

const ScanditScanner = dynamic(() => Promise.resolve(ScanditScannnerMemoized), {
  loading: () => <Loader />,
  ssr: false,
});

export default ScanditScanner;
