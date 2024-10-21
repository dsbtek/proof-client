"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../loaders/pipLoader.css";
import { useDispatch } from "react-redux";
import { setIDType } from "@/redux/slices/appConfig";

interface IPipLoader {
  pipStep?: number;
  isVisible: boolean;
  onClose?: () => void;
}

const PipDocTypeSelect = ({ pipStep, isVisible, onClose }: IPipLoader) => {
  const [docType, setDocType] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(docType, "docType changes");
    dispatch(setIDType(docType));
  }, [dispatch, docType]);

  if (!isVisible) return null;

  return (
    <div className="pip-step-loader-bg">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "white",
          width: "386px",
          padding: "24px",
          borderRadius: "16px",
        }}
      >
        <h3>Document Type</h3>
        <div style={{ marginBottom: "8px" }}>
          Please select document type below to proceed further
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "48%",
              height: "170px",
              gap: 8,
              padding: "8px",
              borderRadius: "24px",
              // backgroundColor: docType === "DL" ? "#81fcbc" : "white",
              border:
                docType === "DL" ? "1px solid #009CF9" : "1px solid #E3E6EB",
            }}
            onClick={() => setDocType("DL")}
          >
            <Image
              src={"/images/driversL.svg"} // Dynamically display the image based on the current index
              alt="Loader Icon"
              className="pip-loader-icon"
              width={5000}
              height={5000}
              loading="lazy"
            />
            <p>Drivers License</p> {/* Dynamically display the description */}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "48%",
              height: "170px",
              gap: 8,
              padding: "8px",
              borderRadius: "24px",
              // backgroundColor: docType === "PS" ? "#81fcbc" : "white",
              border:
                docType === "PS" ? "1px solid #009CF9" : "1px solid #E3E6EB",
            }}
            onClick={() => setDocType("PS")}
          >
            <Image
              src={"/images/passport.svg"} // Dynamically display the image based on the current index
              alt="Loader Icon"
              className="pip-loader-icon"
              width={5000}
              height={5000}
              loading="lazy"
            />
            <p>Passport</p> {/* Dynamically display the description */}
          </div>
        </div>
        <button
          style={{
            width: "338px",
            height: "48px",
            padding: "16px",
            gap: "8px",
            borderRadius: "12px",
            background: "#009CF9",
            color: "#FFFFFF",
            border: "none",
          }}
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PipDocTypeSelect;
