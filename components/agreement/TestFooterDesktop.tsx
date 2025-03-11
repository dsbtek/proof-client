"use client";
import React, { useEffect } from "react";
import { Button } from "@/components";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { BsMortarboardFill, BsFillPersonCheckFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

interface DesktopFooterProps {
  onProgressBar?: boolean;
  onClickBtnLeftAction?: () => void;
  onClickBtnRightAction?: () => void;
  currentNumber?: number;
  outOf?: number;
  btnLeftText?: string;
  btnRightText?: string;
  leftdisabled?: boolean;
  rightdisabled?: boolean;
}

const TestDesktopFooter = ({
  onClickBtnLeftAction,
  onClickBtnRightAction,
  currentNumber,
  outOf,
  btnLeftText,
  btnRightText,
  leftdisabled,
  rightdisabled,
  onProgressBar,
}: DesktopFooterProps) => {
  const progress = (currentNumber! / outOf!) * 100;

  return (
    <div className="test-agreement-footer-container">
      {onProgressBar && (
        <div
          className="deskTopProgressBar"
          style={{ width: `${progress}%` }}
        ></div>
      )}
      <div className="wrap-paginate">
        <div className="paginate">
          <div style={{ whiteSpace: "nowrap" }} className="ms-5">
            Step&nbsp;{currentNumber}&nbsp;
          </div>
          <div className="ms-5">of</div>&nbsp;
          <div className="ms-5">{outOf}</div>
        </div>
      </div>
      <div className="gap-"></div>
      <div className="dxtop-wrap-btn">
        {/* <div className="btn-left"> */}

        <Button
          classname="decline-btn"
          onClick={onClickBtnLeftAction}
          disabled={leftdisabled}
        >
          {btnLeftText ?? ""}
        </Button>

        <Button
          classname="accepted-btn"
          onClick={onClickBtnRightAction}
          disabled={rightdisabled}
        >
          {btnRightText ?? ""}
        </Button>
      </div>
    </div>
  );
};

export default TestDesktopFooter;
