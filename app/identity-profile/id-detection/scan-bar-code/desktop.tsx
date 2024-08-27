// import { Button } from '@/components';
// import React from 'react';
// import { FiEdit } from 'react-icons/fi';
// import { TbCapture } from 'react-icons/tb';
// import { toast } from 'react-toastify';
// // import Button from '../button';

// interface DesktopViewProps {
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

// function DesktopView({
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
// }: DesktopViewProps) {
//     return (
//         <div className='bar-code-scanner-desktop-view'>
//              {/* <div className="barcode-cap-modal"> */}
//             {/* {barcodeUploaded && !enterBarcode && barcode === '' && (
//                 <div className="bc-content">
//                     <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//                     <div className="bc-upload-stats">
//                         <h2 style={{ color: '#24527b' }}>Click on Scan Barcode</h2>
//                         <Button classname="man-btn" onClick={recapture}>Hide Scanner</Button>
//                     </div>
//                 </div>
//             )} */}

//             <div className="wrap-desktop-bar-code-view" style={{padding:"32px"}}>

//             {barcodeUploaded && !enterBarcode && barcode !== '' && (
//                 <div className="bc-content">
//                     <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//                     <div className="sum-text">
//                         <h2 style={{ color: '#24527b' }}>{barcode as string}</h2>
//                         <Button classname="td-right" onClick={handleSaveBarcode}>Confirm</Button>
//                     </div>
//                 </div>
//             )}
// {/* <p>
// Enter the letters and numbers from the top right corner of your Chain of Custody form or 
// capture the barcode image on the sticker you placed on the collection card. Choose to either 
// enter the details manually or scan the barcode to continue.
// </p> */}
            

//             { (
//                 <div className="barcode-btns" style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Button classname="man-btn" onClick={() => setEnterBarcode(true)}>
//                         <FiEdit /> Enter Manually
//                     </Button>
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
                    
//                 </div>
//             )}
//             </div>
//             <div className="wrap-desktop-bar-code-view">
//                  {enterBarcode ? (
//                 <div className="bc-content" style={{height:"100%", backgroundColor:"black"}}>
//                     {/* <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p> */}
//                     <div className="sum-text" style={{display:"flex", flexDirection:"column"}}>
//                         <h4 style={{ color: '#24527b' }}>
//                             Enter Barcode without spaces <span style={{ color: 'red' }}>*</span>
//                         </h4>
//                         <p>
//                         Please enter the barcode from the sticker on the collection card.
//                         </p>
                        
//                     </div>
//                     <div style={{display:"flex", flexDirection:"row", width: "100%", gap:"16px", alignItems:"center"}}>
//                         <input
//                         className="bc-input"
//                         type="text"
//                         placeholder="Enter Barcode or N/A, if no text is present."
//                         onChange={barcodeInput}
//                     />
//                     <Button classname="td-right" onClick={handleSaveBarcode} disabled={barcodeValue === ''}>
//                             Confirm
//                         </Button>
//                     </div>
                    
//                 </div>
//             ):

//             <div className="barcode-cap" style={{ background: '#000000' }}>
//                 <div id="data-capture-view"></div>
//             </div>}
//             </div>
           
//         {/* </div> */}
//         </div>
//     );
// }

// export default DesktopView;
