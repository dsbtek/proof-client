'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiEdit } from 'react-icons/fi';
import { TbCapture } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import Webcam from 'react-webcam';

import '../modals/modal.css';
import Button from '../button';
import Loader from '../loaders/loader';
import {
    saveBarcode,
    setBarcodeKit,
    setDetectKit,
    setIdDetails,
    setTrackingNumber,
} from '@/redux/slices/drugTest';
import { toast } from 'react-toastify';
import { parseAamvaData } from '@/utils/utils';
import { Loader_ } from '..';
import useResponsive from '@/hooks/useResponsive';
import Image from 'next/image';

const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

interface BarcodeCaptureProps {
    show: boolean;
    barcodeUploaded: boolean | undefined;
    step?: number;
    totalSteps?: number;
    scanType: string;
    recapture: boolean;
    closeModal(): void;
    onBarcodeScan?(data: string): void;
    isUsedInModal?: boolean;
    manualBtn?: boolean;
    revealScanDetailsInScanner?: boolean;
    barcodeValue2?: string;
    setBarcodeValue2?: React.Dispatch<React.SetStateAction<string>>;
    captureImageFn?(): void;
    capturedImage?: HTMLImageElement | null;
    setEnterManual?: React.Dispatch<React.SetStateAction<boolean>>;
    packageScanType80?: boolean;
    scanCount?: number;
    setScanCount?: React.Dispatch<React.SetStateAction<number>>;
}

function ScanditScannner_({
    show,
    barcodeUploaded,
    step,
    totalSteps,
    scanType,
    recapture = false,
    closeModal,
    onBarcodeScan,
    isUsedInModal = false,
    manualBtn = true,
    revealScanDetailsInScanner = true,
    barcodeValue2 = '',
    setBarcodeValue2 = undefined,
    captureImageFn,
    capturedImage,
    setEnterManual,
    packageScanType80,
    scanCount,
    setScanCount,
}: BarcodeCaptureProps) {
    const [enterBarcode, setEnterBarcode] = useState(false);
    const [scannerLoad, setScannerLoad] = useState(false);
    const [isInputed, setIsInputed] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState('');
    // const [scanCount, setScanCount] = useState(0);
    const [barcode, setBarcode] = useState<string | Record<string, any>>('');
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
        null,
    );
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

    const dispatch = useDispatch();
    const isDesktop = useResponsive();

    const handleSaveBarcode = async () => {
        setBarcodeValue(barcode as any);

        // Validate both barcodes when `packageScanType80` is enabled
        if (packageScanType80) {
            if (barcode.startsWith('80')) {
                // toast.success("Success");
                console.log('Successfully scan barcode with 80');
            } else if (scanCount! > 1) {
                console.log('Successfully scan barcode with 80');
            } else {
                setScanCount?.(scanCount! + 1);
                toast.error("Error: Barcode must start with '80'.");
                return;
            }
        }

        if (enterBarcode) {
            setEnterBarcode(false);
        }

        scanType === 'test' && dispatch(saveBarcode(barcode as string));
        scanType === 'fedex' && dispatch(setTrackingNumber(barcode as string));
        scanType === 'kit' && dispatch(setBarcodeKit(barcode as string));
        scanType === 'detect' && dispatch(setDetectKit(barcode as string));
        setEnterManual && setEnterManual(false);
        closeModal();
    };

    const barcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsInputed(true);
        const input = e.target.value;
        setBarcodeValue2 && setBarcodeValue2(input);
        setBarcodeValue(input);
        setBarcode(input);
        // Check if the barcode starts with "80"
        const isValid = input.trim() !== '' && input.startsWith('80');
        setIsConfirmEnabled(isValid);
    };

    const runScanner = useCallback(async () => {
        setScannerLoad(true);

        await SDCCore.configure({
            licenseKey: licenseKey as string,
            libraryLocation:
                'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/',
            moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
        });

        const context = await SDCCore.DataCaptureContext.create();

        // Set up the camera with front-facing as the default
        const camera = SDCCore.Camera.atPosition(
            SDCCore.CameraPosition.UserFacing,
        );
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
            scanType === 'id'
                ? [SDCBarcode.Symbology.PDF417]
                : scanType === 'fedex'
                ? [SDCBarcode.Symbology.Code128]
                : generalScanner,
        );

        const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
            context,
            settings,
        );
        await barcodeCapture.setEnabled(false);

        barcodeCapture.addListener({
            didScan: async (barcodeCapture, session) => {
                await barcodeCapture.setEnabled(false);
                setIsInputed(false);

                const barcode = session.newlyRecognizedBarcode;
                const symbology = new SDCBarcode.SymbologyDescription(
                    barcode!.symbology,
                );

                if (scanType === 'id' && symbology.readableName === 'PDF417') {
                    const idData: any = parseAamvaData(barcode!.data);
                    const idDetails = {
                        first_name: idData['First Name'],
                        last_name: idData['Last Name'],
                        date_of_birth:
                            typeof idData['Date of Birth'] === 'number'
                                ? new Date(idData['Date of Birth'])
                                : idData['Date of Birth'],
                        address: idData['Street Address'],
                        city: idData['City'],
                        state: idData['State'],
                        zipcode: idData['Postal Code'],
                    };
                    dispatch(setIdDetails(idDetails));
                    setBarcode(
                        idData['First Name'] +
                            '-' +
                            idData['Last Name'] +
                            '-' +
                            idData["Driver's License Number"],
                    );
                } else {
                    setBarcode(barcode!.data!);
                    setBarcodeValue2 && setBarcodeValue2(barcode!.data!);
                    captureImageFn && captureImageFn();
                }

                if (onBarcodeScan) {
                    onBarcodeScan(barcode!.data!);
                    setBarcodeValue2 && setBarcodeValue2(barcode!.data!);
                    setBarcodeValue(barcode!.data!);
                    captureImageFn && captureImageFn();
                }

                await barcodeCapture.setEnabled(false);
                await camera?.switchToDesiredState(
                    SDCCore.FrameSourceState.Off,
                );
            },
        });

        const view = await SDCCore.DataCaptureView.forContext(context);
        view.connectToElement(
            document?.getElementById('data-capture-view') as HTMLElement,
        );
        view.addControl(new SDCCore.CameraSwitchControl());

        const barcodeCaptureOverlay =
            await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
                barcodeCapture,
                view,
                SDCBarcode.BarcodeCaptureOverlayStyle.Frame,
            );

        const viewfinder = new SDCCore.RectangularViewfinder(
            SDCCore.RectangularViewfinderStyle.Rounded,
            SDCCore.RectangularViewfinderLineStyle.Light,
        );

        await barcodeCaptureOverlay.setViewfinder(viewfinder);

        await camera?.switchToDesiredState(SDCCore.FrameSourceState.On);

        await barcodeCapture.setEnabled(true);

        setScannerLoad(false);
    }, [dispatch, onBarcodeScan, scanType]);

    useEffect(() => {
        runScanner().catch((error) => {
            console.error('Scandit Error:', error);
            toast.error(error);
        });
    }, [runScanner, show]);

    useEffect(() => {
        if (recapture) {
            runScanner().catch((error) => {
                console.error('Scandit Error:', error);
                toast.error(error);
            });
        }
    }, [recapture, runScanner]);

    return (
        show &&
        (!isUsedInModal ? (
            <div className="barcode-cap-modal">
                {barcodeUploaded &&
                    !enterBarcode &&
                    barcode === '' &&
                    !isDesktop &&
                    revealScanDetailsInScanner && (
                        <div className="bc-content" style={{ height: '100px' }}>
                            {/* {scanType === "id" && step && totalSteps && (
                ""
              )} */}
                            {/* {scanType !== 'id' && <div className='bc-upload-stats'>
                        <h2 style={{ color: '#24527b' }}></h2>
                        <Button classname='man-btn' onClick={recapture}>Hide Scanner</Button>
                    </div>} */}
                        </div>
                    )}

                {capturedImage && barcodeValue2 !== '' && (
                    <img
                        src={capturedImage?.src}
                        alt="Captured"
                        style={{
                            width: '100%',
                            height: isDesktop ? 'calc(100% - 80px)' : '100%',
                            position: 'absolute',
                            bottom: 0,
                            zIndex: 99,
                        }}
                    />
                )}

                {barcodeUploaded &&
                    !enterBarcode &&
                    (barcode !== '' || barcodeValue2) &&
                    revealScanDetailsInScanner && (
                        <div className="bc-content">
                            <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
                            <div className="sum-text">
                                <h2
                                    style={{
                                        color: '#24527b',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {(barcode as string) || barcodeValue2}
                                </h2>
                                <Button
                                    classname="td-right"
                                    onClick={handleSaveBarcode}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    )}

                {enterBarcode && revealScanDetailsInScanner && (
                    <div
                        className="bc-content"
                        style={{ backgroundColor: 'white', zIndex: 9999 }}
                    >
                        {/* <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p> */}
                        <div className="sum-text">
                            <h4 style={{ color: '#24527b' }}>
                                Enter Barcode without spaces{' '}
                                <span style={{ color: 'red' }}>*</span>
                            </h4>
                            <Button
                                classname="td-right"
                                onClick={() => {
                                    setEnterBarcode(false);
                                    handleSaveBarcode();
                                }}
                                disabled={!barcode.startsWith('80')}
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
                <div className="barcode-cap" style={{ background: '#000000' }}>
                    {scannerLoad && <Loader_ />}

                    <div
                        // className="id-card-frame-guide"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            zIndex: 999,
                            position: 'absolute',
                            padding: '8px',
                        }}
                    >
                        {scanType === 'id' ? (
                            <div className="box">
                                <div className="content"></div>
                            </div>
                        ) : (
                            <div>
                                <Image
                                    style={{ width: '100%', height: 'auto' }}
                                    src="/images/barcode-guide.svg"
                                    alt="captured Image"
                                    width={2000}
                                    height={2000}
                                />
                            </div>
                        )}
                    </div>

                    <div id="data-capture-view"></div>
                </div>
                {!enterBarcode && (
                    <div
                        className="barcode-btns"
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {(barcode || barcodeValue2) && (
                            <Button
                                classname="cap-btn"
                                onClick={() => {
                                    setBarcode('');
                                    setBarcodeValue2 && setBarcodeValue2('');
                                    runScanner().catch((error) => {
                                        console.error('Scandit Error:', error);
                                        toast.error(error);
                                    });
                                }}
                                disabled={!barcode && !barcodeValue2}
                            >
                                <TbCapture /> Rescan
                            </Button>
                        )}
                        {scanType !== 'id' && manualBtn && (
                            <Button
                                classname="man-btn"
                                onClick={() => {
                                    setBarcode('');
                                    setEnterBarcode(true);
                                }}
                            >
                                <FiEdit /> Enter Manually
                            </Button>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                <div
                    // className="id-card-frame-guide"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        zIndex: 999,
                        position: 'absolute',
                        padding: '8px',
                    }}
                >
                    <div>
                        <Image
                            style={{ width: '100%', height: 'auto' }}
                            src="/images/barcode-guide.svg"
                            alt="captured Image"
                            width={2000}
                            height={2000}
                        />
                    </div>
                </div>
                <div
                    id="data-capture-view"
                    style={{ borderRadius: '20px' }}
                ></div>
            </div>
        ))
    );
}

const Scannner_80 = dynamic(() => Promise.resolve(ScanditScannner_), {
    loading: () => <Loader />,
    ssr: false,
});

export default Scannner_80;
