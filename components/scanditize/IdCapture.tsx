"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  CameraSettings,
  Translations as CoreTranslations,
} from "scandit-web-datacapture-core";
import {
  Camera,
  CameraSwitchControl,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  Localization,
  configure,
} from "scandit-web-datacapture-core";
import type {
  CapturedId,
  IdCaptureError,
  IdCaptureSession,
  Translations as IdTranslations,
} from "scandit-web-datacapture-id";
import {
  IdCapture,
  IdCaptureErrorCode,
  IdCaptureOverlay,
  IdCaptureSettings,
  IdDocumentType,
  IdImageType,
  SupportedSides,
  idCaptureLoader,
} from "scandit-web-datacapture-id";
import Loader from "../loaders/loader";
import { useDispatch } from "react-redux";
import {
  saveBarcode,
  setBarcodeKit,
  setDetectKit,
  setIdDetails,
  setTrackingNumber,
} from "@/redux/slices/drugTest";
import Button from "../button";
import { FiEdit } from "react-icons/fi";
import useResponsive from "@/hooks/useResponsive";

const LICENSE_KEY = process.env.NEXT_PUBLIC_SCANDIT_KEY;

type Mode = "barcode" | "mrz" | "viz";

interface Prop {
  show: boolean;
  barcodeUploaded: boolean | undefined;
  step?: number;
  totalSteps?: number;
  scanType: string;
  recapture(): void;
  closeModal(): void;
}

const IdCaptureComponent = ({
  show,
  barcodeUploaded,
  step,
  totalSteps,
  scanType,
  recapture,
  closeModal,
}: Prop) => {
  const dataCaptureViewRef = useRef<HTMLDivElement | null>(null);
  // let context: DataCaptureContext;
  // let idCapture: IdCapture;
  const idCapture = useRef<IdCapture | null>(null); // Use ref for idCapture
  // let view: DataCaptureView;
  let overlay: IdCaptureOverlay;

  let context = useRef<DataCaptureContext | null>(null); // Ref for context
  const view = useRef<DataCaptureView | null>(null); // Ref for view
  let camera = useRef<Camera | null>(null);
  let currentMode = useRef<Mode | null>(null);

  const [enterBarcode, setEnterBarcode] = useState(false);
  const dispatch = useDispatch();
  const isDesktop = useResponsive();
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcode, setBarcode] = useState<string | Record<string, any>>("");

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

  //result of scanning passport
  const showResult = async (capturedId: CapturedId) => {
    // Implement UI display logic for showing the captured ID result
    console.log("Captured ID:", capturedId);
    if (scanType === "id") {
      // const idData: any = parseAamvaData(barcode!.data);
      const idDetails = {
        first_name: capturedId["firstName"] as string,
        last_name: capturedId["lastName"] as string,
        date_of_birth:
          capturedId.dateOfBirth?.day +
          "" +
          capturedId.dateOfBirth?.month +
          " " +
          capturedId.dateOfBirth?.year,
        address: capturedId.address as string,
        city: capturedId.address as string,
        state: capturedId.issuingCountryIso as string,
        zipcode: capturedId.address as string,
      };
      dispatch(setIdDetails(idDetails));
      setBarcode(
        capturedId["firstName"] +
          "-" +
          capturedId["lastName"] +
          "-" +
          capturedId.documentNumber
      );
    } else {
      setBarcode(capturedId);
    }

    await idCapture.current!.setEnabled(false);
    await camera.current!.switchToDesiredState(FrameSourceState.Off);
  };

  // create Id capture
  const createIdCapture = useCallback(
    async (settings: IdCaptureSettings): Promise<void> => {
      idCapture.current = await IdCapture.forContext(context.current, settings);

      idCapture.current.addListener({
        didCaptureId: async (
          idCaptureInstance: IdCapture,
          session: IdCaptureSession
        ) => {
          await idCapture.current!.setEnabled(false);
          const capturedId = session.newlyCapturedId;
          if (!capturedId) return;

          if (capturedId.vizResult?.isBackSideCaptureSupported) {
            if (
              capturedId.vizResult.capturedSides === SupportedSides.FrontAndBack
            ) {
              showResult(capturedId);
              void idCapture.current!.reset();
            } else {
              confirmScanningBackside(capturedId);
            }
          } else {
            showResult(capturedId);
            void idCapture.current!.reset();
          }
        },
        didRejectId: async () => {
          await idCapture.current!.setEnabled(false);
          showWarning("Document type not supported.");
          void idCapture.current!.reset();
        },
        didFailWithError: (_: IdCapture, error: IdCaptureError) => {
          if (error.type === IdCaptureErrorCode.RecoveredAfterFailure) {
            showWarning(
              "Oops, something went wrong. Please start over by scanning the front-side of your document."
            );
            void idCapture.current!.reset();
          }
        },
      });

      await view.current!.removeOverlay(overlay);
      overlay = await IdCaptureOverlay.withIdCaptureForView(
        idCapture.current!,
        view.current!
      );
    },
    []
  );

  //create settings for the id capture
  const createIdCaptureSettingsFor = useCallback(
    (mode: Mode): IdCaptureSettings => {
      const supportedDocumentsByMode: { [key in Mode]: IdDocumentType[] } = {
        barcode: [
          IdDocumentType.AAMVABarcode,
          IdDocumentType.ColombiaIdBarcode,
          IdDocumentType.ColombiaDlBarcode,
          IdDocumentType.USUSIdBarcode,
          IdDocumentType.ArgentinaIdBarcode,
          IdDocumentType.SouthAfricaDlBarcode,
          IdDocumentType.SouthAfricaIdBarcode,
          IdDocumentType.CommonAccessCardBarcode,
        ],
        mrz: [
          IdDocumentType.VisaMRZ,
          IdDocumentType.PassportMRZ,
          IdDocumentType.SwissDLMRZ,
          IdDocumentType.IdCardMRZ,
          IdDocumentType.ChinaMainlandTravelPermitMRZ,
          IdDocumentType.ChinaExitEntryPermitMRZ,
          IdDocumentType.ChinaOneWayPermitFrontMRZ,
          IdDocumentType.ChinaOneWayPermitBackMRZ,
          IdDocumentType.ApecBusinessTravelCardMRZ,
        ],
        viz: [IdDocumentType.DLVIZ, IdDocumentType.IdCardVIZ],
      };
      const settings = new IdCaptureSettings();
      settings.supportedDocuments = supportedDocumentsByMode[mode];
      if (mode === "viz") {
        settings.supportedSides = SupportedSides.FrontAndBack;
        settings.setShouldPassImageTypeToResult(IdImageType.Face, true);
      }
      return settings;
    },
    []
  );

  //run scanner function
  const run = useCallback(async () => {
    view.current = new DataCaptureView();
    if (dataCaptureViewRef.current) {
      view.current!.connectToElement(dataCaptureViewRef.current);
    }

    view.current!.showProgressBar();

    await configure({
      licenseKey: process.env.NEXT_PUBLIC_SCANDIT_KEY!,
      // libraryLocation: new URL("library/engine/", document.baseURI).toString(),
      libraryLocation:
        "https://cdn.jsdelivr.net/npm/scandit-web-datacapture-id@6.x/build/engine/",
      moduleLoaders: [idCaptureLoader({ enableVIZDocuments: true })],
    });

    view.current!.hideProgressBar();

    context.current = await DataCaptureContext.create();
    await view.current!.setContext(context.current);

    camera.current = Camera.default;
    const settings: CameraSettings = IdCapture.recommendedCameraSettings;
    await camera.current!.applySettings(settings);
    await context.current!.setFrameSource(camera.current!);

    view.current!.addControl(new CameraSwitchControl());

    currentMode.current = "mrz"; // Adjust as needed to get the selected mode
    await createIdCapture(createIdCaptureSettingsFor(currentMode.current!));
    await idCapture.current!.setEnabled(false);

    await camera.current!.switchToDesiredState(FrameSourceState.On);
    await idCapture.current!.setEnabled(true);
  }, [createIdCapture, createIdCaptureSettingsFor]);

  //init scanner in useEffect
  useEffect(() => {
    console.log(idCapture.current);
    if (!idCapture.current!) {
      run().catch((error: unknown) => {
        console.error(error);
        alert((error as Error).toString());
      });
    }

    return () => {
      const cleanup = async () => {
        if (idCapture.current) {
          await idCapture.current.setEnabled(false);
          await idCapture.current.reset();
          idCapture.current = null; // Clear the reference for future runs
        }

        if (camera.current) {
          await camera.current.switchToDesiredState(FrameSourceState.Off);
        }

        if (context.current) {
          await context.current.dispose();
          context.current = null; // Clear the context reference
        }

        if (view.current) {
          view.current.detachFromElement();
          view.current = null; // Clear the view reference
        }
      };

      cleanup().catch(console.error);
    };
  }, [run]);

  const confirmScanningBackside = (capturedId: CapturedId) => {
    // Implement UI display logic for confirming backside scanning
    console.log("Please scan the backside of the ID:", capturedId);
  };

  const showWarning = (message: string) => {
    // Implement UI display logic for warnings
    console.warn(message);
    alert(message); // Example: using alert for simplicity
  };

  return (
    true && (
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        <div
          ref={dataCaptureViewRef}
          style={{
            zIndex: 9000,
            width: "100%",
            height: "70%",
          }}
        />

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

        {scanType !== "id" && (
          <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
            <FiEdit /> Enter Manually
          </Button>
        )}
      </div>
    )
  );
};

const PassportCapture = dynamic(() => Promise.resolve(IdCaptureComponent), {
  loading: () => <Loader />,
  ssr: false,
});

export default PassportCapture;
