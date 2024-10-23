"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import { useDispatch } from "react-redux";
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";
import Webcam from "react-webcam";

import "../modals/modal.css";
import Button from "../button";
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

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

interface BarcodeCaptureProps {
  show: boolean;
  barcodeUploaded: boolean | undefined;
  step?: number;
  totalSteps?: number;
  scanType: string;
  recapture(): void;
  closeModal(): void;
  onBarcodeScan?(data: string): void;
}

function ScanditScannner({
  show,
  barcodeUploaded,
  step,
  totalSteps,
  scanType,
  recapture,
  closeModal,
  onBarcodeScan,
}: BarcodeCaptureProps) {
  const [enterBarcode, setEnterBarcode] = useState(false);
  const [scannerLoad, setScannerLoad] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcode, setBarcode] = useState<string | Record<string, any>>("");
  const cameraRef = useRef<Webcam | null>(null);

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
    setScannerLoad(true);

    await SDCCore.configure({
      licenseKey: licenseKey as string,
      libraryLocation:
        "https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/",
      moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
    });

    const context = await SDCCore.DataCaptureContext.create();
    const cameraSettings = SDCBarcode.BarcodeCapture.recommendedCameraSettings;

    const camera = SDCCore.Camera.default;
    if (camera) {
      await camera.applySettings(cameraSettings);
    }
    await context.setFrameSource(camera);
    const settings = new SDCBarcode.BarcodeCaptureSettings();
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

    const symbologySetting = settings.settingsForSymbology(
      SDCBarcode.Symbology.Code39
    );
    symbologySetting.activeSymbolCounts = [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];

    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      context,
      settings
    );
    await barcodeCapture.setEnabled(false);

    barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        await barcodeCapture.setEnabled(false);
        const barcode = session.newlyRecognizedBarcode;
        const symbology = new SDCBarcode.SymbologyDescription(
          barcode!.symbology
        );

        if (scanType === "id" && symbology.readableName === "PDF417") {
          console.log(barcode!.data);
          const idData: any = parseAamvaData(barcode!.data);
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
        }

        // Check if onBarcodeScan function is provided
        if (onBarcodeScan) {
          onBarcodeScan(barcode!.data!);
        }

        await barcodeCapture.setEnabled(false);
        await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
      },
    });

    const view = await SDCCore.DataCaptureView.forContext(context);
    view.connectToElement(
      document?.getElementById("data-capture-view") as HTMLElement
    );
    view.addControl(new SDCCore.CameraSwitchControl());

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

    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);

    await barcodeCapture.setEnabled(true);

    setScannerLoad(false);
  }, [dispatch, onBarcodeScan, scanType]);

  useEffect(() => {
    runScanner().catch((error) => {
      console.error("Scandit Error:", error);
      toast.error(error);
    });
  }, [runScanner, show]);

  return (
    show && (
      <div className="barcode-cap-modal">
        {barcodeUploaded && !enterBarcode && barcode === "" && !isDesktop && (
          <div className="bc-content">
            {scanType === "id" && step && totalSteps && (
              <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
            )}
            {/* {scanType !== 'id' && <div className='bc-upload-stats'>
                        <h2 style={{ color: '#24527b' }}></h2>
                        <Button classname='man-btn' onClick={recapture}>Hide Scanner</Button>
                    </div>} */}
          </div>
        )}

        {barcodeUploaded && !enterBarcode && barcode !== "" && (
          <div className="bc-content">
            <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
            <div className="sum-text">
              <h2 style={{ color: "#24527b" }}>{barcode as string}</h2>
              <Button classname="td-right" onClick={handleSaveBarcode}>
                Confirm
              </Button>
            </div>
          </div>
        )}

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
                onClick={handleSaveBarcode}
                disabled={barcodeValue === "" ? true : false}
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
        <div className="barcode-cap" style={{ background: "#000000" }}>
          {scannerLoad && <Loader_ />}

          <div
            // className="id-card-frame-guide"
            style={{
              display: "flex",
              // alignItems: "center",
              justifyContent: "center",
              width: "100%",
              // height: "100%",

              position: "absolute",
            }}
          >
            <div className="box">
              <div className="content"></div>
            </div>
          </div>

          <div id="data-capture-view"></div>
        </div>
        {!enterBarcode && (
          <div
            className="barcode-btns"
            style={{ flexDirection: "column", alignItems: "center" }}
          >
            <Button
              classname="cap-btn"
              onClick={() => {
                runScanner().catch((error) => {
                  console.error("Scandit Error:", error);
                  toast.error(error);
                });
              }}
            >
              <TbCapture /> Rescan
            </Button>
            {scanType !== "id" && (
              <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
                <FiEdit /> Enter Manually
              </Button>
            )}
          </div>
        )}
      </div>
    )
  );
}

const Scannner = dynamic(() => Promise.resolve(ScanditScannner), {
  loading: () => <Loader />,
  ssr: false,
});

export default Scannner;
