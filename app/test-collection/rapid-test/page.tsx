// Timer


"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { AgreementHeader, AgreementFooter } from "@/components";
import useResponsive from "@/hooks/useResponsive";

const RapidTest = () => {
    const isDesktop = useResponsive();


    return (
        <div className="container-test-collection">
            <AgreementHeader title="PIP - Step 3" />
            {!isDesktop ?
                <div className="agreement-items-wrap">
                    <Image className="get-started-img" src="/images/alco-test.svg" alt="alco-test" width={3000} height={3000} />
                    <p className="idd-txt m-5">
                        Instructions:
                        <br />
                        <br />
                        <li>Place the test device on a solid color background.</li>
                        <li>Use the silhouette on your screen and align the device properly within the silhouette.</li>
                    </p>
                </div>
                :
                <div className="test-items-wrap-desktop_">
                    <div className="sub-item">
                        <p className="idd-txt m-5">
                            Instructions:
                            <br />
                            <br />
                            <li>Place the test device on a solid color background.</li>
                            <li>Use the silhouette on your screen and align the device properly within the silhouette.</li>
                        </p>
                    </div>
                    <Image className="get-started-img" src="/images/alco-test.svg" alt="alco-test" width={3000} height={3000} />

                </div>
            }
            <AgreementFooter currentNumber={3} outOf={4} onPagination={false} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/identity-profile/facial-capture"} btnLeftText={"Decline"} btnRightText={"Next"} />
        </div>
    );
};
export default RapidTest;
