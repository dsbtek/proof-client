"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import "../loaders/pipLoader.css";
import "./scan-package-barcode.css";
import { useDispatch } from "react-redux";
import { appData, setIDType } from "@/redux/slices/appConfig";
import { TbCapture } from "react-icons/tb";
import Scannner from "../scanditize";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { testBarcodeData } from "@/utils/testsBarcodeData";
import { useSelector } from "react-redux";
import Button from "../button";
import { setDetectKit, setKit } from "@/redux/slices/drugTest";
import { setPreTestScreens } from "@/redux/slices/pre-test";
import { extractAndFormatPreTestScreens } from "@/utils/utils";
import { useRouter } from "next/navigation";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import { CiCircleInfo } from "react-icons/ci";
import AppHeader from "../appHeader";
import useResponsive from "@/hooks/useResponsive";
import { GoArrowLeft } from "react-icons/go";
import Header from "../appHeader/header";
import DdBarcodeScanner from "../DdBarcodeScanner/DdBarcodeScanner";
import ZxingBarcodeScanner from "../zxingScanner/ZxingBarcodeScanner";

interface IPipLoader {
  pipStep?: number;
  isVisible: boolean;
  onClose?: () => void;
  setIsVisible: (a: boolean) => void;
}

const ScanPackageForTest = ({
  isVisible,
  onClose,
  setIsVisible,
}: IPipLoader) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDesktop = useResponsive();
  const scanType = "test";

  const [identifiedKit, setIdentifiedKit] = useState<any>();
  //   const [showBCModal, setShowBCModal] = useState<boolean>(isVisible);
  const [closeCamera, setCloseCamera] = useState<boolean>(false);
  const [kitNotFound, setKitNotFound] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [reCapture, setRecapture] = useState<boolean>(false);
  const { drug_kit } = useSelector(appData);

  const closeBCModal = () => {
    setIsVisible(false);
  };

  const closeComp = () => {
    setCloseCamera(true);
  };

  useEffect(() => {
    if (closeCamera) {
      closeBCModal();
      onClose && onClose();
    }
  }, [closeCamera, onClose]);

  useEffect(() => {
    if (typeof window !== "undefined") {
    }
  }, [isVisible]);

  const handleOnScan = (barcode: keyof typeof testBarcodeData) => {
    const kit_id = testBarcodeData[barcode];
    dispatch(setDetectKit(barcode));
    console.log(kit_id, "kit_id");
    const kit = drug_kit.find((i: any) => i.kit_id === kit_id);
    setIdentifiedKit(kit);
    console.log(kit, "kit");
    if (kit) {
      setScanComplete(true);
    } else {
      setKitNotFound(true);
    }
  };

  const onConfirm = () => {
    dispatch(setKit(identifiedKit));
    dispatch(setPreTestScreens(extractAndFormatPreTestScreens(identifiedKit)));
    router.push("/test-collection/system-check");
  };
  if (!isVisible) return null;

  return (
    <div
      className="pip-step-loader-bg"
      onClick={(event) => event.stopPropagation()}
    >
      {isDesktop ? (
        <div className="package-scan-modal">
          {kitNotFound ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>No test found</h3>

                  <IoIosCloseCircleOutline size={24} onClick={closeComp} />
                </div>

                <div
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  We are sorry that the automated detection could not detect
                  your kit, please Retry or select Manually.
                </div>
                <Button
                  blue
                  onClick={() => setKitNotFound(false)}
                  type="submit"
                >
                  <TbCapture /> Rescan
                </Button>
              </div>
            </>
          ) : scanComplete ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <h3>Scan Package to Take Test</h3>

                <IoIosCloseCircleOutline size={24} onClick={closeComp} />
              </div>
              <div style={{ marginBottom: "8px" }}>
                Confirm you are taking the {identifiedKit.kit_name} test
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Button
                  white
                  type="submit"
                  onClick={() => setScanComplete(false)}
                >
                  No
                </Button>
                <Button blue type="submit" onClick={onConfirm}>
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  borderRadius: "12px",
                }}
              >
                <h3>Scan Package to Take Test</h3>

                <IoIosCloseCircleOutline size={24} onClick={closeComp} />
              </div>
              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                Please scan the Bar/QR Code on the outside of the collection kit
                box
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  backgroundColor: "black",
                  borderRadius: "20px",
                  width: "100%",
                  height: "400px",
                  overflow: "hidden",
                }}
              >
                <ZxingBarcodeScanner
                  show={isVisible}
                  scanType=""
                  barcodeUploaded={true}
                  isUsedInModal
                  recapture={false}
                  closeModal={closeBCModal}
                  onBarcodeScan={handleOnScan}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  border: "1px solid #97D8FF",
                  borderRadius: "20px",
                  backgroundColor: "#E5F5FF",
                  width: "100%",
                  padding: "16px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    minWidth: "40px",
                    minHeight: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50px",
                    backgroundColor: "#BEE7FF",
                    border: "1px solid #97D8FF",
                  }}
                >
                  <CiCircleInfo size={24} />
                </span>
                <span>
                  <p style={{ color: "#0C1617" }}>
                    If you are unable to scan the Bar/QR Code, please close to
                    select the test manually.
                  </p>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="package-scan-modal"
          style={{
            minWidth: "100vw",
            height: "100dvh",
            overflowY: "scroll",
          }}
        >
          {kitNotFound ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>No test found</h3>
                </div>

                <div
                  style={{
                    marginBottom: "8px",
                    lineHeight: "28px",
                  }}
                >
                  We are sorry that the automated detection could not detect
                  your kit, please Retry or select Manually.
                </div>
                <Button
                  blue
                  onClick={() => setKitNotFound(false)}
                  type="submit"
                >
                  <TbCapture /> Rescan
                </Button>
                <Button
                  white
                  onClick={onClose}
                  // disabled={!scanComplete}
                  type="submit"
                >
                  Manually pick
                </Button>
              </div>
            </>
          ) : scanComplete ? (
            <>
              <div
                style={{
                  marginBottom: "8px",
                  marginTop: "16px",
                }}
              >
                Confirm you are taking the {identifiedKit.kit_name} test
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "16px",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Button
                  white
                  type="submit"
                  onClick={() => setScanComplete(false)}
                >
                  No
                </Button>
                <Button blue type="submit" onClick={onConfirm}>
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                gap: 4,
                backgroundColor: "#F4F7F8",
              }}
            >
              <Header
                title="Package Barcode Scanner"
                icon1={<GoArrowLeft />}
                hasMute={false}
              />
              <p
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  fontWeight: 300,
                  textAlign: "center",
                }}
              >
                Please scan the Bar/QR Code on the outside of the collection kit
                box
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  backgroundColor: "black",
                  width: "100%",
                  maxHeight: "400px",
                  flexGrow: 1,
                  overflow: "hidden",
                }}
              >
                {/* <DdBarcodeScanner
                  show={isVisible}
                  scanType=""
                  barcodeUploaded={true}
                  isUsedInModal
                  recapture={false}
                  closeModal={closeBCModal}
                  onBarcodeScan={handleOnScan}
                /> */}
                <ZxingBarcodeScanner
                  show={isVisible}
                  scanType=""
                  barcodeUploaded={true}
                  isUsedInModal
                  recapture={false}
                  closeModal={closeBCModal}
                  onBarcodeScan={handleOnScan}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                  padding: "16px",
                  overflow: "hidden",
                  flexGrow: 1,
                }}
              >
                <span>
                  <p
                    style={{
                      color: "#0C1617",
                      fontWeight: 600,
                    }}
                  >
                    Note:
                  </p>
                </span>
                <span>
                  <p
                    style={{
                      color: "#0C1617",
                      fontWeight: 300,
                    }}
                  >
                    If you are unable to scan the Bar/QR Code, tap manual pick
                    to select the test manually.
                  </p>
                </span>
                <Button
                  blue
                  onClick={onClose}
                  // disabled={!scanComplete}
                  type="submit"
                >
                  Manually pick
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPackageForTest;
