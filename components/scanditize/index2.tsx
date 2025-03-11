// "use client";

// import {
//   DocumentType,
//   DocumentSelection,
//   IdBoltSession,
//   Region,
//   ReturnDataMode,
//   Validators,
// } from "@scandit/web-id-bolt";
// import dynamic from "next/dynamic";
// import Loader from "../loaders/pageLoader";

// const licenseKey = process.env.NEXT_PUBLIC_SCANDIT_KEY;

// interface BarcodeCaptureProps {}

// function ScanditBoltScannner({}: BarcodeCaptureProps) {
//   const ID_BOLT_URL = "https://app.id-scanning.com";

//   const LICENSE_KEY =
//     "AqvFrhSwMWZ0RcSaRxAPCIIqsr5XAvdFYDSQmzcTNxD9GoIUHk7ijBhwHM+STOOW+GgOLDwcWWPFbRlZ5izCXnMyuVaQZUHDYjHz1K8jF2o0FPHAbXSjZ1tDXKe9XUQDLFpKVHsaa4stF53qYghwTHBBkKilSaFrw2QnHXVmr9mhSIT/qAMAATh0+8D6eghXxE8bpPoyDgsDCp+UEibMIXRS2CP/L2mVLW7p/Fp2TnzFHpE7gmJxPUhC5bDSSnPnrA99gVIVOmh7ciP1OmQmKyJmkvnbdqdyW3zglcJsS88Nf8716E4eSwliJCUAbQ+nMGAUS6Yt8k+BEbHiPG4DUQAYQ29wVVbPbVEWvfFxU/7sICY3mFfbxzgXwTBrXOZuWnRyzZtZy9nAQu/yzkcyXMFKbAjySEDbGXSDigRCORLEenCrPFtoXkENLE+LarDx7EJMO/V1DzgOLUlmslx9c98+uljZS2GKDl67ipBV3VCXbEo2EmSPSMEuSfyoUX6a3HRu9UsAOjeiZ07koG0wh0BqH00SGc7x8lTQz5hSlPWwauxLcTTBe6JiwKDhwnpAzFQvVEa7KuREJeiubktcI+z0FCeubBdcmBJYzW212qRtmvEy6t7IIR3BSRULMc1U5959XvNFF46t3YP1An62OGj8RNMoNPST3XO7jJNv9JITnrEqooRVNHaPDJtni61R6uEXyv7sxjQr6GmsXX4wPwZynVkPZXoH3HcOKsy17tyx9hqWplFLBQXOI1fpNyYcEJd9Teb/LCRJQvzsBkvDC945Hz6UGIq6x7pdJ4O/JaezuO1le2WvIaCjuubMdEdzKQ8zAjl1JgEGUdHikxa9+KjKaP6gSOLrM3obGQziJY49RalfHLkZ6uj78voMUGm6iiNNIbt/QL/Gx/XfnwnaDxPiEjUmzcbxfhUVWBikxLAFNzkQLH8QpjFm0NvBdIjMrOT3op5dK0RNTHycS7c0kl4FrlqgxcLNjcftWQS3pYlKGpSt3SxwTzb18uCUJlWV1zQUOGkW3bw+NJw67d94hD8cF2WCvJTXf2DaB37P2NJNrmpnGCbXemmjqPjTFXdIq0ow+gI9ZgA0JSCdB/rDcRn5uJzLTaQ2hYokJk3Iwa0RLzthoq5ocQZ0V27jMr3IeUJCv1BAWMEUQh5/ZycZEbmSF7ytyQehZ/OYpvoUs9sPajxmyTf5Y0ztk4CJNJhLdQAu+hpV/EmmFnrAQ2KyptTIV64yMla8sA==";

//   // Aq8FRBafM4oTBgMouw0gfv0KrWueI64Xkx3zF4EGcfSiZK4/UywqfrxUh36XclbFiGolp3wOi8kYCb701wJUGxRG/XNrV2uKRlPAH08Wve+xVslX1xjpCdU3a7ydOEnEuQwfm7EbvLG1cWUc13GPJ0pHCpnbL821SQ90RbEcx83gU/O8bBhlG9p1eCvBN4EyCC9v1Is+u6aEYqMyrnynLHJacLpCOYLGjg35Jc9433nYLbyUNj9TLUJoz4GvX621rhY+DOUMkw4lO71f1yfhwe0pDKAOdHi+JAwg8gUN06b9AgVtmXWv+WIko+mEBKL9YhzGk9EbhmOhF3eRghTiNe0njcrNDvyb80AiZbR6NGaTceJYo3kTQ9ohn658VfPzfE3UaO9/pX9/epu3OT1ohdUg+LMrcBaO7mvRhIECz9taecOyqBZd43Ve3kfLQQUCgmaQ8M57vt8fWMd1VhMCNOVnJy47XMh9f0oFSoo+Ks5VbaW79m9KpDpwHQSOe750G3a2b4FL6wJDYN536yafRVtq/Cd6Q1K6YE3gLz0bGGnOJ/Ft3SCd7PJ1GV+5V4aHGGauNBctk5XsWBLvHHK0KolOryuWekj0rnT7NckBtSBIVJOz21R19n0P8GqjZJFRtjg60r9TSdK2cTo6R2k1UJk1elKTSgPVi0FEMgBbyKK8Tscv0WPjtO1RQLKCfkwFghWFFjtHARsuYZ42+l/e5P1UV3/xXT0FdD/fEkZFLCbycAziGSO1jg4kjt5sY/daZ3ypsP5ixaMavs/9CtZ/qPSdqaNItjque8eAxPnIgE/QQShv6x+0uiVas2GGo5hacokffQ1tG4qwECZSOUAaZE1Oh7C7FWT4LnpCDiQncwqAy2fXmNRCgFcmaK8cstHGTtHJoGYh2k3KbCiTxlwrQRCNYVXgvlZNdWgKXYGdZgkx9QuJXp0smJOer2/vb+N0wlaGXXjOojelExS9u8DVvOEoOLrP1FCM0tjCkJCxXA9xAcL0FsoLrtwwqqs1DINFnNOWXRNHo1KdjXRR+gFjAYE4B3KajPXRCgySk4UlNytSzH4BDOZPwVFba1e4UuIlbQvhsDwWILp19SFHk0H7ZQ65oFW55+lxQDOFmnTPpUmXiWCeitoSjVd3jH4xyR17pNpElCjy7Zo8cSrRlbqUb5q1At6kIRjTFiiBOzceYBqucjnUV0I3bNo1/tu6FzgVnD6KhzcX6q0ly1bkTCrxOJBrdJSv0Hs1cmOiI0a03p4bHBMa9jH2JcfAEza1R11I3XEvfCywPywFwrI/R9Ef0LTCgvyV+DeeUaL2SKfOzDPz3MgdAqfAzR8+mMj2YugI12xeOkX6+SwFcyQskXI86gVx9HEn9hw6d/tZoHySsrPB+PaMAiWebqncJyjfoF00VxslJGhcDtF9QRIE0zS/dEnoZFh4iclgOY1HmA==
//   async function startIdBolt() {
//     // define which documents are allowed to be scanned. More complex rules can be added.
//     const documentSelection = DocumentSelection.create({
//       accepted: [],
//     });
//     // initialization of the ID Bolt session
//     const idBoltSession = IdBoltSession.create(ID_BOLT_URL, {
//       licenseKey: LICENSE_KEY,
//       documentSelection,
//       // define what data you expect in the onCompletion listener (set below)
//       returnDataMode: ReturnDataMode.FullWithImages,
//       // add validation rules on the scanned document
//       validation: [Validators.notExpired()],
//       locale: "en",
//       onCompletion: (result: any) => {
//         // the ID has been captured and validation was successful. In this example the result
//         // will contain the document data because `returnDataMode` was set to RETURN_DATA_MODE.FULL.
//         alert(`Thank you ${result.capturedId.fullName}`);
//       },
//       onCancellation: () => {
//         // the ID Bolt pop-up has been closed by the user without finishing the scan process.
//       },
//     });
//     // open the pop-up
//     await idBoltSession.start();
//   }

//   // open ID Bolt when some button is clicked
//   const someButton = document.getElementById("someButton");
//   someButton?.addEventListener("click", startIdBolt);

//   return <button id="someButton">Start ID Bolt</button>;
// }

// const Scannner = dynamic(() => Promise.resolve(ScanditBoltScannner), {
//   loading: () => <Loader />,
//   ssr: false,
// });

// export default Scannner;

// <div className="barcode-cap-modal">
//         {barcodeUploaded &&
//           !enterBarcode &&
//           barcode === "" &&
//           !isDesktop &&
//           revealScanDetailsInScanner && (
//             <div className="bc-content" style={{ height: "100px" }}>
//               {scanType === "id" && step && totalSteps && (
//                 <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//               )}
//             </div>
//           )}

//         {capturedImage && barcodeValue2 !== "" && (
//           <img
//             src={capturedImage?.src}
//             alt="Captured"
//             style={{
//               width: "100%",
//               height: isDesktop ? "calc(100% - 80px)" : "100%",
//               position: "absolute",
//               bottom: 0,
//               zIndex: 99,
//             }}
//           />
//         )}

//         {barcodeUploaded &&
//           !enterBarcode &&
//           (barcode !== "" || barcodeValue2) &&
//           revealScanDetailsInScanner && (
//             <div className="bc-content">
//               <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//               <div className="sum-text">
//                 <h2
//                   style={{
//                     color: "#24527b",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {(barcode as string) || barcodeValue2}
//                 </h2>
//                 <Button classname="td-right" onClick={handleSaveBarcode}>
//                   Confirm
//                 </Button>
//               </div>
//             </div>
//           )}

//         {enterBarcode && revealScanDetailsInScanner && (
//           <div
//             className="bc-content"
//             style={{ backgroundColor: "white", zIndex: 9999 }}
//           >
//             <p className="test-steps">{`Step ${step} of ${totalSteps}`}</p>
//             <div className="sum-text">
//               <h4 style={{ color: "#24527b" }}>
//                 Enter Barcode without spaces{" "}
//                 <span style={{ color: "red" }}>*</span>
//               </h4>
//               <Button
//                 classname="td-right"
//                 onClick={() => {
//                   setEnterBarcode(false);
//                   handleSaveBarcode();
//                 }}
//                 disabled={
//                   barcodeValue === "" || barcodeValue2 === "" ? true : false
//                 }
//               >
//                 Confirm
//               </Button>
//             </div>
//             <input
//               className="bc-input"
//               type="text"
//               placeholder="Enter Barcode or N/A, if no text is present."
//               onChange={barcodeInput}
//             />
//           </div>
//         )}
//         <div className="barcode-cap" style={{ background: "#000000" }}>
//           {scannerLoad && <Loader_ />}

//           <div
//             // className="id-card-frame-guide"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: "100%",
//               height: "100%",
//               zIndex: 999,
//               position: "absolute",
//               padding: "8px",
//             }}
//           >
//             {scanType === "id" ? (
//               <div className="box">
//                 <div className="content"></div>
//               </div>
//             ) : (
//               <div>
//                 <Image
//                   style={{ width: "100%", height: "auto" }}
//                   src="/images/barcode-guide.svg"
//                   alt="captured Image"
//                   width={2000}
//                   height={2000}
//                 />
//               </div>
//             )}
//           </div>

//           <div id="data-capture-view"></div>
//         </div>
//         {!enterBarcode && (
//           <div
//             className="barcode-btns"
//             style={{
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             {(barcode || barcodeValue2) && (
//               <Button
//                 classname="cap-btn"
//                 onClick={() => {
//                   setBarcode("");
//                   setBarcodeValue2 && setBarcodeValue2("");
//                   runScanner().catch((error) => {
//                     console.error("Scandit Error:", error);
//                     toast.error(error);
//                   });
//                 }}
//                 disabled={!barcode && !barcodeValue2}
//               >
//                 <TbCapture /> Rescan
//               </Button>
//             )}
//             {scanType !== "id" && manualBtn && (
//               <Button
//                 classname="man-btn"
//                 onClick={() => {
//                   setBarcode("");
//                   setEnterBarcode(true);
//                 }}
//               >
//                 <FiEdit /> Enter Manually
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
