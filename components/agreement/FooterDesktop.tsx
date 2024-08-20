'use client'
import React from "react";
import { Button } from "@/components";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { BsMortarboardFill, BsFillPersonCheckFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

interface DesktopFooterProps {
    onPagination: boolean;
    onLeftButton: boolean;
    onRightButton: boolean;
    onClickBtnLeftAction?: () => void;
    onClickBtnRightAction?: () => void;
    currentNumber?: number;
    outOf?: number;
    btnLeftLink?: string; // Optional link
    btnRightLink?: string; // Optional link
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
}: DesktopFooterProps) => {
    return (
        <div className="agreement-footer-container">
            {onPagination && (
                <div className="paginate">

                    <div>Step {currentNumber}</div> <div>of</div> <div>{outOf}</div>
                </div>
            )}
            <div className="dxtop-wrap-btn">
                <div className="btn-left">
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
                </div>

                <div className="btn-right">
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
                </div>
            </div>


        </div>
    );
};

export default DesktopFooter;
