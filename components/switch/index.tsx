"use client";

import { useState } from "react";

import "./switch.css";

interface SwitchProps {
  onToggle: () => void;
  checked?: boolean;
  showLabel?: boolean;
}

const Switch = ({ onToggle, checked, showLabel }: SwitchProps) => {
  return (
    <div className="wrap-check">
      <p className={checked ? "grid-view" : "list-view"}>
        {!showLabel ? "" : checked && showLabel ? "Grid View" : "List View"}
      </p>
      <button
        className={`switch ${checked ? "switchOn" : "switchOff"}`}
        onClick={onToggle}
      >
        <span className="slider"></span>
      </button>
    </div>
  );
};

export default Switch;
