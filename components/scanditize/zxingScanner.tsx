// import React, { useRef, useEffect, useState } from "react";
// import {
//   BarcodeFormat,
//   BrowserMultiFormatReader,
//   Result,
// } from "@zxing/library";
// import Webcam from "react-webcam";

// interface Props {
//   cameraRef: React.RefObject<any>;
// }
// const BarcodeScannerIOS: React.FC<Props> = ({ cameraRef }) => {
//   console.log("component Rendered");
//   const [barcode, setBarcode] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const codeReader = useRef(new BrowserMultiFormatReader());
//   console.log(cameraRef.current, "camera Ref in scanner1");

//   useEffect(() => {
//     const scan = () => {
//       console.log(cameraRef.current, "camera Ref in scanner");
//       if (cameraRef.current) {
//         const imageSrc = cameraRef.current.getScreenshot(); // Get the current video frame

//         if (imageSrc) {
//           codeReader.current
//             .decodeFromImageUrl(imageSrc)
//             .then((result: Result) => {
//               console.log(result, "barcode scanner result");
//               // Check if the result is a Code 128 barcode
//               if (result.getBarcodeFormat() === BarcodeFormat.CODE_128) {
//                 setBarcode(result.getText());
//                 setError(null); // Clear any previous error
//               }
//             })
//             .catch((err) => {
//               if (!(err instanceof Error)) {
//                 setError(err);
//               }
//             });
//         }
//       }
//     };

//     const intervalId = setInterval(scan, 2000); // Scan every second
//     // Capture the current instance of codeReader for cleanup
//     const currentReader = codeReader.current;

//     return () => {
//       clearInterval(intervalId);
//       currentReader.reset();
//     };
//   }, [cameraRef]);

//   return (
//     <div style={{ marginTop: "80px" }}>
//       <h1>Barcode Scanner</h1>
//       {/* <Webcam
//                 // key={webcamKey}
//                 className="test-camera-container"
//                 ref={videoRef}
//                 audio={false}
//                 screenshotFormat="image/png"
//                 videoConstraints={{
//                   facingMode: "user",
//                 }}
//                 imageSmoothing={true}
//                 mirrored
//               /> */}
//       {barcode && <p>Scanned Barcode: {barcode}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default BarcodeScannerIOS;

// //  //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //  const [barcode, setBarcode] = useState<string>("");
// //  const [error, setError] = useState<string | null>(null);

// //  useEffect(() => {
// //    const codeReader = new BrowserMultiFormatReader();

// //    const startScanning = async () => {
// //      try {
// //        // const stream = await navigator.mediaDevices.getUserMedia({
// //        //   video: true,
// //        // });
// //        if (videoRef.current) {
// //          //   videoRef.current.srcObject = stream;

// //          codeReader.decodeFromVideoDevice(
// //            null,
// //            videoRef.current,
// //            (result: Result | null, err: any) => {
// //              if (result) {
// //                console.log(result, "barCode Result");
// //                setBarcode(result.getText());
// //                setError(null); // Clear any previous error
// //              }
// //              if (err && !(err instanceof Error)) {
// //                setError(err);
// //              }
// //            }
// //          );
// //        }
// //      } catch (err) {
// //        console.error("Error accessing camera: ", err);
// //        setError("Could not access camera.");
// //      }
// //    };

// //    startScanning();

// //    return () => {
// //      codeReader.reset();
// //      if (videoRef.current) {
// //        const stream = videoRef.current.srcObject as MediaStream;
// //        if (stream) {
// //          stream.getTracks().forEach((track) => track.stop());
// //        }
// //      }
// //    };
// //  }, [videoRef]);
