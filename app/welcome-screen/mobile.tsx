"use client"

import { Carousel, CheckBox, HeaderText } from '@/components';
import React, { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Link from "next/link";
import styles from "./welcome-screen.module.css"


interface IWelcomeScreen {
    handleSwitch: () => void;
    tokenCookie: string | undefined;
    checked: boolean;
}
const WelcomeScreenMobile = ({ handleSwitch, tokenCookie, checked }: IWelcomeScreen) => {

    return (
        <div className={styles.welcomeScreenContaine}>
            {/* <HeaderText
                    title="Welcome"
                    text="PROOF is a mobile solution that simplifies data management and facilitates customized testing programs. You have received an account to PROOF to perform one or more of the following tasks."
            /> */}
            <h2 className={styles.welcomeScreenHeader}>Welcome</h2>
            <p className={styles.welcomeScreenText}>PROOF is a mobile solution that simplifies data management and facilitates customized testing programs. You have received an account to PROOF to perform one or more of the following tasks</p>
            <Carousel />
            <div className={styles.welcomeScreenCheckboxNextBtnContainer}>
                <CheckBox
                    checked={checked}
                    onChange={handleSwitch}
                    label="Don`t show welcome screen."
                />
                <Link href={tokenCookie !== undefined ? "/tutorial" : "/auth/sign-in"}>
                    <button className={styles.welcomeScreenNextBtn}>
                        Next
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default WelcomeScreenMobile;
