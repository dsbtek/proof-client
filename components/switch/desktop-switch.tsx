"use client";

import { useState } from "react";
import Image from 'next/image';

import "./switch.css";

interface DesktopSwitchProps {
    onToggleGridView: (isActive: boolean) => void;
    onToggleListView: (isActive: boolean) => void;
    title?: string;
    description?: string;
}

const DesktopSwitch = ({ title, description, onToggleGridView, onToggleListView }: DesktopSwitchProps) => {
    const [switchGridView, setSwitchGridView] = useState(false);
    const [switchListView, setSwitchListView] = useState(true);

    const handleToggleListView = () => {
        setSwitchListView(true);
        setSwitchGridView(false);
        onToggleListView(true);
        onToggleGridView(false);
    };

    const handleToggleGridView = () => {
        setSwitchGridView(true);
        setSwitchListView(false);
        onToggleGridView(true);
        onToggleListView(false);
    };

    return (
        <div className="wrap-desktop-switch">
            <div className="title-desc">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="desktop-switch-btn-wrap">
                <button
                    className="btn-desktop-switch"
                    onClick={handleToggleListView}
                >
                    {switchListView ? (
                        <Image className="btn-desktop-img" src="/icons/active-desktop-list-view.svg" width={5000} height={5000} alt="List view icon" loading="lazy" />
                    ) : (
                        <Image className="btn-desktop-img" src="/icons/desktop-list-view.svg" width={5000} height={5000} alt="List view icon" loading="lazy" />
                    )}
                </button>

                <button
                    className="btn-desktop-switch"
                    onClick={handleToggleGridView}
                >
                    {switchGridView ? (
                        <Image className="btn-desktop-img" src="/icons/active-grid-view-icon.svg" width={5000} height={5000} alt="Grid view icon" loading="lazy" />
                    ) : (
                        <Image className="btn-desktop-img" src="/icons/grid-view-icon.svg" width={5000} height={5000} alt="Grid view icon" loading="lazy" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default DesktopSwitch;
