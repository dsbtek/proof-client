"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import useResponsive from "@/hooks/useResponsive";
// import '../modals/modal.css';
import { saveBarcode } from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';
import { parseAamvaData } from '@/utils/utils';
import DesktopView from './desktop';
import MobileView from './mobile';
import { AppHeader, Loader } from '@/components';

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

interface BarcodeCaptureProps {
    show: boolean;
    barcodeUploaded: boolean | undefined;
    step?: number;
    totalSteps?: number;
    scanType: string;
    recapture(): void;
    closeModal(): void;
}

function BarcodeCaptureContainer({ show, barcodeUploaded, step, totalSteps, scanType, recapture, closeModal }: BarcodeCaptureProps) {
    const [enterBarcode, setEnterBarcode] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [barcode, setBarcode] = useState<string | Record<string, any>>('');
    const isDesktop = useResponsive();
    const dispatch = useDispatch();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleSaveBarcode = () => {
        if (enterBarcode) {
            setEnterBarcode(false);
        }
        closeModal();
    };

    const barcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const barcode = e.target.value;
        setBarcodeValue(barcode);
        dispatch(saveBarcode(barcode));
    };

    async function runScanner() {
        await SDCCore.configure({
            licenseKey: licenseKey as string,
            libraryLocation: 'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/',
            moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
        });

        const context = await SDCCore.DataCaptureContext.create();
        const camera = SDCCore.Camera.default;
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
        settings.enableSymbologies(scanType !== 'id' ? generalScanner : [SDCBarcode.Symbology.PDF417]);

        const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
        symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
        await barcodeCapture.setEnabled(false);

        barcodeCapture.addListener({
            didScan: async (barcodeCapture, session) => {
                await barcodeCapture.setEnabled(false);
                const barcode = session.newlyRecognizedBarcodes[0];
                const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);

                if (scanType === 'id' && symbology.readableName === 'PDF417') {
                    const idData = parseAamvaData(barcode.data);
                    setBarcode(JSON.stringify(idData!));
                } else {
                    setBarcode(barcode.data!);
                }

                await barcodeCapture.setEnabled(false);
                await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
            },
        });

        const view = await SDCCore.DataCaptureView.forContext(context);
        view.connectToElement(document?.getElementById("data-capture-view") as HTMLElement);
        view.addControl(new SDCCore.CameraSwitchControl());

        const barcodeCaptureOverlay = await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
            barcodeCapture,
            view,
            SDCBarcode.BarcodeCaptureOverlayStyle.Frame
        );

        const viewfinder = new SDCCore.RectangularViewfinder(
            SDCCore.RectangularViewfinderStyle.Square,
            SDCCore.RectangularViewfinderLineStyle.Light
        );

        await barcodeCaptureOverlay.setViewfinder(viewfinder);
        await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
        await barcodeCapture.setEnabled(true);
    }
    const recapture_ = () => {
        setCapturedImage('')
    }
    // Props for both views
    const commonProps = {
        enterBarcode,
        barcodeValue,
        barcode,
        handleSaveBarcode,
        barcodeInput,
        runScanner,
        setEnterBarcode,
};

    return (
      
            <div className="barcode-scanner-container">
                {isDesktop ? (
          <>
          <AppHeader title={"Bar Code Scanner"} />
          <DesktopView recapture={recapture_} {...commonProps} />
          </>
                ) : (
                    <MobileView  recapture={recapture_} {...commonProps} />
                )}
            </div>
        
    );
}

const BarcodeCapture = dynamic(() => Promise.resolve(BarcodeCaptureContainer), {
    loading: () => <Loader />,
    ssr: false,
});

export default BarcodeCapture;
