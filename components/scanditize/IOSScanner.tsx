"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  setIdDetails,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import { toast } from "react-toastify";
import useResponsive from "@/hooks/useResponsive";
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";
import { parseAamvaData } from "@/utils/utils";
import Webcam from "react-webcam";
import Image from "next/image";
import { sharpenImage } from "@/utils/imageProcess";

interface VideoCaptureProps {
  show: boolean;
  barcodeUploaded: boolean | undefined;
  step?: number;
  totalSteps?: number;
  scanType: string;
  recapture(): void;
  closeModal(): void;
  // videoRef: React.RefObject<HTMLVideoElement>;
  cameraRef: React.RefObject<Webcam | null>;
  onBarcodeScan?(data: string): void;
  barcodeValue2?: string;
  setBarcodeValue2?: React.Dispatch<React.SetStateAction<string>>;
  captureImageFn?(): void;
  capturedImage?: HTMLImageElement | null;
}

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

const IOSScanner: React.FC<VideoCaptureProps> = ({
  show,
  barcodeUploaded,
  step,
  totalSteps,
  scanType = "fedex",
  cameraRef,
  recapture,
  closeModal,
  onBarcodeScan,
  barcodeValue2 = "",
  setBarcodeValue2 = undefined,
  captureImageFn,
  capturedImage,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<SDCCore.DataCaptureContext | null>(null);
  const settingsRef = useRef<SDCBarcode.BarcodeCaptureSettings | null>(null);

  // hooks
  const dispatch = useDispatch();
  const isDesktop = useResponsive();

  // use states
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  // console.log(imageElement, "image element available");

  const [canStartScanning, setCanStartScanning] = useState(true);
  const [enterBarcode, setEnterBarcode] = useState(false);
  const [scannerLoad, setScannerLoad] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcode, setBarcode] = useState<string | Record<string, any>>("");

  const barcodeListener = {
    didScan: async (
      barcodeCapture: SDCBarcode.BarcodeCapture,
      session: SDCBarcode.BarcodeCaptureSession
    ) => {
      setCanStartScanning(false);
      await barcodeCapture.setEnabled(false);
      const barcode = session.newlyRecognizedBarcode;
      const symbology = new SDCBarcode.SymbologyDescription(barcode!.symbology);

      console.log(barcode, "Barcode");

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
        console.log(barcode, "Barcode inside");
        setBarcode(barcode!.data!);
        captureImageFn && captureImageFn();
      }

      if (onBarcodeScan) {
        onBarcodeScan(barcode!.data!);
        setBarcode(barcode!.data!);
        captureImageFn && captureImageFn();
      }

      await barcodeCapture.setEnabled(false);
    },
  };

  // -----------------------------------------------------------start run scanner function------------------------//
  const runScanner = useCallback(async (imageElement: HTMLImageElement) => {
    const source = await SDCCore.ImageFrameSource.fromImage(imageElement);
    console.log(source, "source");
    await contextRef.current!.setFrameSource(source);

    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      contextRef.current!,
      settingsRef.current!
    );

    barcodeCapture.addListener(barcodeListener);
    await source?.switchToDesiredState(SDCCore.FrameSourceState.On);
    await barcodeCapture.setEnabled(true);
  }, []);

  // -----------------------------------------------------------end run scanner function------------------------//

  useEffect(() => {
    (async () => {
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

      if (settings) {
        settingsRef.current = settings;
      }
      console.log(contextRef, "from here context");
    })();
  }, [scanType]);

  useEffect(() => {
    if (canStartScanning && imageElement?.src) {
      console.log("we are running run");
      runScanner(imageElement).catch((error) => {
        console.error("Scandit Error:", error);
        toast.error(error);
      });
    }
  }, [runScanner, show, canStartScanning, imageElement]);

  //usefffect captures screenshot every second
  useEffect(() => {
    const captureImage = () => {
      if (cameraRef.current && barcode === "") {
        const screenshot = cameraRef.current!.getScreenshot();

        if (screenshot) {
          // // Apply sharpening effect
          // sharpenImage(screenshot)
          // .then((sharpenedBase64) => {
          // console.log(sharpenedBase64, "in here sharpened");
          const img = new window.Image();
          img.src = screenshot as string;
          setImageElement(img);
          // })
          // .catch((error) => {
          // console.error("Error sharpening image:", error);
          // });
        }
      }
    };

    // Capture image every second
    intervalRef.current = window.setInterval(captureImage, 1000);

    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraRef, barcode]);

  //set videoRef from cameraRef
  useEffect(() => {
    if (cameraRef.current) {
      const screenshot = cameraRef.current!.getScreenshot();
      console.log(cameraRef, screenshot, videoRef, "logs");
      if (videoRef.current) {
        videoRef.current!.srcObject = cameraRef.current!.video
          ?.srcObject as MediaProvider;
      }

      console.log(
        videoRef.current!.srcObject,
        cameraRef.current!.video?.srcObject,
        "source video"
      );
    }
  }, [cameraRef, barcode]);

  // ------------------------------------ functions

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
    setBarcodeValue2 && setBarcodeValue2(barcodeInput);
    scanType === "test" && dispatch(saveBarcode(barcodeInput));
    scanType === "fedex" && dispatch(setTrackingNumber(barcodeInput));
    scanType === "kit" && dispatch(setBarcodeKit(barcodeInput));
    scanType === "detect" && dispatch(setDetectKit(barcodeInput));
  };

  // console.log(capturedImage, "from ios scanner");
  // console.log(imageElement, "image element from ios scanner when set");
  console.log(
    videoRef,
    "videoRef/n",
    scanType,
    "scanType/n",
    cameraRef,
    "cameraRef/n",
    barcode,
    "barcode"
  );
  return (
    show && (
      <div className="barcode-cap-modal">
        <div className="barcode-cap" style={{ background: "#000000" }}>
          <div
            // className="id-card-frame-guide"
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

          <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
            {barcode === "" && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}

            {imageElement && barcode !== "" && (
              <img
                src={imageElement?.src ? imageElement?.src : capturedImage?.src}
                alt="Captured"
                style={{
                  width: "100%",
                  height: "500px",
                  bottom: 0,
                  zIndex: 99,
                }}
              />
            )}
            {capturedImage && barcodeValue2 !== "" && (
              <img
                src={imageElement?.src ? imageElement?.src : capturedImage?.src}
                alt="Captured"
                style={{ width: "100%", height: "500px" }}
              />
            )}
          </div>
        </div>
        {!enterBarcode && (
          <div
            className="barcode-btns"
            style={{
              flexDirection: "column",
              alignItems: "center",
              bottom: 0,
              top: 0,
            }}
          >
            {barcode && (
              <Button
                classname="cap-btn"
                onClick={() => {
                  // runScanner().catch((error) => {
                  //   console.error("Scandit Error:", error);
                  //   toast.error(error);
                  // });
                  setCanStartScanning(true);
                  setBarcode("");
                  setBarcodeValue2 && setBarcodeValue2("");
                  setImageElement(null);
                }}
                disabled={barcode === "" && barcodeValue2 === ""}
              >
                <TbCapture /> Rescan
              </Button>
            )}
          </div>
        )}
      </div>
    )
  );
};

const IScannner = dynamic(() => Promise.resolve(IOSScanner), {
  loading: () => <Loader />,
  ssr: false,
});

export default IScannner;

// if (videoRef.current && canvasRef.current) {
//   const context = canvasRef.current.getContext("2d");
//   if (context) {
//     canvasRef.current.width = videoRef.current.videoWidth;
//     canvasRef.current.height = videoRef.current.videoHeight;

//     context.drawImage(
//       videoRef.current,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );
//     const dataUrl = canvasRef.current.toDataURL("image/png");

//     const img = new Image();

//     img.src = dataUrl;
//     setImageElement(img);
//   }
// }
