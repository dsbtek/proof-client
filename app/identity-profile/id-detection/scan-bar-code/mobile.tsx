// import { Button } from '@/components';
// import React from 'react';
// import { FiEdit } from "react-icons/fi";
// import { TbCapture } from "react-icons/tb";
// import { toast, ToastContentProps } from 'react-toastify';

// interface MobileViewProps {
//     enterBarcode: boolean;
//     barcodeValue: string;
//     barcode: string | Record<string, any>;
//     handleSaveBarcode: () => void;
//     barcodeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     runScanner: () => void;
//     setEnterBarcode: (value: boolean) => void;
//     barcodeUploaded?: boolean | undefined;
//     step?: number;
//     totalSteps?: number;
//     recapture(): void;
// }

// function MobileView({
//     enterBarcode,
//     barcodeValue,
//     barcode,
//     handleSaveBarcode,
//     barcodeInput,
//     runScanner,
//     setEnterBarcode,
//     barcodeUploaded,
//     step,
//     totalSteps,
//     recapture,
// }: MobileViewProps) {
//     return (
//         <div className="barcode-cap-modal">
//             {barcodeUploaded && !enterBarcode && barcode === '' && (
//                 <div className="bc-content">
//                     <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//                     <div className="bc-upload-stats">
//                         <h2 style={{ color: '#24527b' }}>Click on Scan Barcode</h2>
//                         <Button classname="man-btn" onClick={recapture}>Hide Scanner</Button>
//                     </div>
//                 </div>
//             )}

//             {barcodeUploaded && !enterBarcode && barcode !== '' && (
//                 <div className="bc-content">
//                     <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//                     <div className="sum-text">
//                         <h2 style={{ color: '#24527b' }}>{barcode as string}</h2>
//                         <Button classname="td-right" onClick={handleSaveBarcode}>Confirm</Button>
//                     </div>
//                 </div>
//             )}

//             {enterBarcode && (
//                 <div className="bc-content">
//                     <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//                     <div className="sum-text">
//                         <h4 style={{ color: '#24527b' }}>
//                             Enter Barcode without spaces <span style={{ color: 'red' }}>*</span>
//                         </h4>
//                         <Button classname="td-right" onClick={handleSaveBarcode} disabled={barcodeValue === ''}>
//                             Confirm
//                         </Button>
//                     </div>
//                     <input
//                         className="bc-input"
//                         type="text"
//                         placeholder="Enter Barcode or N/A, if no text is present."
//                         onChange={barcodeInput}
//                     />
//                 </div>
//             )}

//             <div className="barcode-cap" style={{ background: '#000000' }}>
//                 <div id="data-capture-view"></div>
//             </div>

//             {!enterBarcode && (
//                 <div className="barcode-btns" style={{ flexDirection: 'column', alignItems: 'center' }}>
//                     <Button
//                         classname="cap-btn"
//                         onClick={async () => {
//                             try {
//                                 await runScanner();
//                             } catch (error) {
//                                 console.error(error);
//                                 toast.error(error as any);
//                             }
//                         }}
//                     >
//                         <TbCapture /> Scan Barcode
//                     </Button>
//                     <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
//                         <FiEdit /> Enter Manually
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default MobileView;
