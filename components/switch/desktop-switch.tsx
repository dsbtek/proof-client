"use client";

import { useState } from "react";
import Image from "next/image";

import "./switch.css";
import { usePathname } from "next/navigation";

interface DesktopSwitchProps {
  onToggleGridView: () => void;
  onToggleListView: () => void;
  title?: string;
  description?: string;
  switchGridView: boolean;
  switchListView: boolean;
  toggleScan?: () => void;
}

const DesktopSwitch = ({
  title,
  description,
  onToggleGridView,
  onToggleListView,
  switchGridView,
  switchListView,
  toggleScan,
}: DesktopSwitchProps) => {
  const pathname = usePathname();
  const isTestCollectionPg = pathname === "/test-collection";

  return (
    <div className="wrap-desktop-switch">
      <div className="title-desc">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="desktop-switch-btn-wrap">
        {isTestCollectionPg && (
          <Image
            onClick={toggleScan}
            className="desktop-scan-icon"
            src={"/icons/scan-icon.png"}
            alt="proof image"
            width={3000}
            height={3000}
            loading="lazy"
          />
        )}
        <button className="btn-desktop-switch" onClick={onToggleListView}>
          {switchListView ? (
            <Image
              className="btn-desktop-img"
              src="/icons/active-desktop-list-view.svg"
              width={5000}
              height={5000}
              alt="List view icon"
              loading="lazy"
            />
          ) : (
            <Image
              className="btn-desktop-img"
              src="/icons/desktop-list-view.svg"
              width={5000}
              height={5000}
              alt="List view icon"
              loading="lazy"
            />
          )}
        </button>

        <button className="btn-desktop-switch" onClick={onToggleGridView}>
          {switchGridView ? (
            <Image
              className="btn-desktop-img"
              src="/icons/active-grid-view-icon.svg"
              width={5000}
              height={5000}
              alt="Grid view icon"
              loading="lazy"
            />
          ) : (
            <Image
              className="btn-desktop-img"
              src="/icons/grid-view-icon.svg"
              width={5000}
              height={5000}
              alt="Grid view icon"
              loading="lazy"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default DesktopSwitch;
