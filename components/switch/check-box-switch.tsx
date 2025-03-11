"use client";

import { useState } from "react";

import "./switch.css";

interface CheckBoxProps {
    onToggle: () => void;
    checked?: boolean;
    showLabel?: boolean;
}

const CheckBoxSwitch = ({ onToggle, checked, showLabel }: CheckBoxProps) => {
    return (
        <div className="view-switch-wrap">

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
        </div>
    );
};

export default CheckBoxSwitch;