"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../loaders/pipLoader.css";
import { useDispatch } from "react-redux";
import { setIDType } from "@/redux/slices/appConfig";

interface IPipLoader {
  pipStep: number;
  isVisible: boolean;
  onClose?: () => void;
}

const PipDocTypeSelect = ({ pipStep, isVisible, onClose }: IPipLoader) => {
  const [docType, setDocType] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(docType, "docType changes");
    dispatch(setIDType(docType));
  }, [docType]);

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
        <div style={{ marginBottom: "8px" }}>
          Please Select Document Type below
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: "8px",
            borderRadius: "8px",
            backgroundColor: docType === "DL" ? "#81fcbc" : "white",
            border:
              docType === "DL" ? "1px solid #10B981" : "1px solid #777777",
          }}
          onClick={() => setDocType("DL")}
        >
          <div className={`progress-step ${pipStep >= 1 ? "active" : ""}`}>
            1
          </div>
          <p>Drivers License</p> {/* Dynamically display the description */}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: "8px",
            borderRadius: "8px",
            backgroundColor: docType === "PS" ? "#81fcbc" : "white",
            border:
              docType === "PS" ? "1px solid #10B981" : "1px solid #777777",
          }}
          onClick={() => setDocType("PS")}
        >
          <div className={`progress-step ${pipStep >= 1 ? "active" : ""}`}>
            2
          </div>
          <p>Passport</p> {/* Dynamically display the description */}
        </div>
        <button className="pip-step-loader-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PipDocTypeSelect;
