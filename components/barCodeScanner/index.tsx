"use client";

import { useState } from 'react'
import dynamic from 'next/dynamic';
import { FiEdit } from "react-icons/fi";
import { TbCapture } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';

import '../modals/modal.css';
import Button from '../button';
import MiniLoader from '../loaders/miniLoader';
import Loader from '../loaders/loader';
import { saveBarcode } from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';
import { parseAamvaData } from '@/utils/utils';

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY

interface BarcodeCaptureProps {
    show: boolean;
    barcodeUploaded: boolean | undefined;
    step?: number;
    totalSteps?: number;
    scanType: string;
    recapture(): void;
    closeModal(): void;
}

function ScanditScannner({ show, barcodeUploaded, step, totalSteps, scanType, recapture, closeModal }: BarcodeCaptureProps) {
    const [enterBarcode, setEnterBarcode] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [barcode, setBarcode] = useState<string | Record<string, any>>('');

    const dispatch = useDispatch();

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
            moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
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
        ]
        settings.enableSymbologies(scanType !== 'id' ? generalScanner : [SDCBarcode.Symbology.PDF417]);

        console.log('scantype:', scanType)

        const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
        symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
        await barcodeCapture.setEnabled(false);

        barcodeCapture.addListener({
            didScan: async (barcodeCapture, session) => {

                await barcodeCapture.setEnabled(false);
                const barcode = session.newlyRecognizedBarcodes[0];
                const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);

                console.log('bars', session.newlyRecognizedBarcodes, barcode, symbology.readableName)

                if (scanType === 'id' && symbology.readableName === 'PDF417') {
                    console.log(barcode.data)
                    const idData = parseAamvaData(barcode.data);
                    setBarcode(JSON.stringify(idData!))
                } else {
                    setBarcode(barcode.data!)
                };

                await barcodeCapture.setEnabled(false);
                await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
            },
        });

        const view = await SDCCore.DataCaptureView.forContext(context);
        view.connectToElement(document?.getElementById("data-capture-view") as HTMLElement);
        view.addControl(new SDCCore.CameraSwitchControl());

        const barcodeCaptureOverlay =
            await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
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

    return (
        
        show && <div className='barcode-cap-modal'>
            {barcodeUploaded && !enterBarcode && barcode === '' &&
                <div className='bc-content'>
                    <p className='test-steps'>{`Step ${step} of ${totalSteps}`}</p>
                    <div className='bc-upload-stats'>
                        <h2 style={{ color: '#24527b' }}>Click on Scan Barcode</h2>
                        <Button classname='man-btn' onClick={recapture}>Hide Scanner</Button>
                    </div>
                </div>}

            {barcodeUploaded && !enterBarcode && barcode !== '' && <div className='bc-content'>
                <p className='test-steps'>{`Step ${step} of ${totalSteps}`}</p>
                <div className='sum-text'>
                    <h2 style={{ color: '#24527b' }}>{barcode as string}</h2>
                    <Button classname='td-right' onClick={handleSaveBarcode}>Confirm</Button>
                </div>
            </div>}

            {enterBarcode && <div className='bc-content'>
                <p className='test-steps'>{`Step ${step} of ${totalSteps}`}</p>
                <div className='sum-text'>
                    <h4 style={{ color: '#24527b' }}>Enter Barcode without spaces <span style={{ color: 'red' }}>*</span></h4>
                    <Button classname='td-right' onClick={handleSaveBarcode} disabled={barcodeValue === '' ? true : false}>Confirm</Button>
                </div>
                <input className='bc-input' type='text' placeholder='Enter Barcode or N/A, if no text is present.' onChange={barcodeInput} />
            </div>}
            <div className='barcode-cap' style={{ background: '#000000' }}>
                <div id="data-capture-view">
                </div >
            </div>
            {!enterBarcode && 
            <div className='barcode-btns' style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Button classname='cap-btn' onClick={() => {
                    runScanner().catch((error) => {
                        console.error(error);
                        toast.error(error);
                    })
                }}><TbCapture /> Scan Barcode</Button>
                <Button classname='man-btn' onClick={() => setEnterBarcode(true)}><FiEdit /> Enter Manually</Button>
            </div>}
        </div>
    )
}

const Scannner = dynamic(() =>
    Promise.resolve(ScanditScannner), {
    loading: () => <Loader />,
    ssr: false,
});

export default Scannner;