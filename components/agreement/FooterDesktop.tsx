'use client'
import React, { useEffect } from "react";
import { Button } from "@/components";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { BsMortarboardFill, BsFillPersonCheckFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

interface DesktopFooterProps {
    onPagination: boolean;
    onLeftButton: boolean;
    onRightButton: boolean;
    onProgressBar?: boolean;
    onClickBtnLeftAction?: () => void;
    onClickBtnRightAction?: () => void;
    currentNumber?: number;
    outOf?: number;
    btnLeftLink?: string;
    btnRightLink?: string;
    btnLeftText?: string;
    btnRightText?: string;
    leftdisabled?: boolean;
    rightdisabled?: boolean;
}

const DesktopFooter = ({
    onPagination,
    onLeftButton,
    onRightButton,
    onClickBtnLeftAction,
    onClickBtnRightAction,
    currentNumber,
    outOf,
    btnLeftLink,
    btnRightLink,
    btnLeftText,
    btnRightText,
    leftdisabled,
    rightdisabled,
    onProgressBar,
}: DesktopFooterProps) => {
    const progress = (currentNumber! / outOf!) * 100;
    return (
        <div className="agreement-footer-container" style={{ position: "fixed" }}>
            {onProgressBar && <div className="deskTopProgressBar" style={{ width: `${progress}%` }}></div>}
            <div className="wrap-paginate">
            {onPagination && (
                <div className="paginate">

                        <div style={{ width: "50px", gap: "8px" }} className="ms-5">Step {currentNumber} </div><div className="ms-5">of</div><div className="ms-5">{outOf}</div>
                </div>
            )}
            </div>
            <div className="gap-"></div>
            <div className="dxtop-wrap-btn">
                {/* <div className="btn-left"> */}
                    {onLeftButton && btnLeftLink != '' ? (
                        <Link href={btnLeftLink ?? ''}>
                            <Button
                                classname="decline-btn"
                                onClick={onClickBtnLeftAction}
                                disabled={leftdisabled}
                            >{btnLeftText ?? ''}</Button>
                        </Link>
                    ) : (
                        onLeftButton && (
                            <Button
                                classname="decline-btn"
                                onClick={onClickBtnLeftAction}
                                disabled={leftdisabled}
                            >
                                {btnLeftText ?? ''}
                            </Button>
                        )

                    )}
                {/* </div> */}

                {/* <div className="btn-right"> */}
                    {onRightButton && btnRightLink != '' ? (
                        <Link href={btnRightLink ?? ''}>
                            <Button
                                classname="accepted-btn"
                                onClick={onClickBtnRightAction}
                                disabled={rightdisabled}
                            >
                                {btnRightText ?? ''}
                            </Button>
                        </Link>
                    ) : (
                        onRightButton && (
                            <Button
                                classname="accepted-btn"
                                onClick={onClickBtnRightAction}
                                disabled={rightdisabled}
                            >
                                {btnRightText ?? ''}
                            </Button>
                        )
                    )}
                {/* </div> */}
            </div>


        </div>
    );
};

export default DesktopFooter;
