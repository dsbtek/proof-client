"use client"

import { Carousel, CheckBox, HeaderText } from '@/components';
import React, { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Link from "next/link";


interface IWelcomeScreen {
    handleSwitch: () => void;
    tokenCookie: string | undefined;
    checked: boolean;
}
const WelcomeScreenDesktop = ({ handleSwitch, tokenCookie, checked }: IWelcomeScreen) => {

    return (
        <>
            <div className="welcome-screen-">

                <HeaderText
                    title="Welcome"
                    text="PROOF is a mobile solution that simplifies data management and facilitates customized testing programs. You have received an account to PROOF to perform one or more of the following tasks."
                />
            </div>
            <Carousel />
            <div className="qe-btn-cont">
                <CheckBox
                    checked={checked}
                    onChange={handleSwitch}
                    label="Don`t show welcome screen."
                />
                <Link href={tokenCookie !== undefined ? "/tutorial" : "/auth/sign-in"}>
                    <button className="qe-btn">
                        <IoIosArrowForward />
                    </button>
                </Link>
            </div>
        </>
    );
};

export default WelcomeScreenDesktop;
