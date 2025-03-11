"use client";
import Image from "next/image";
import useResponsive from "@/hooks/useResponsive";
import {
  AgreementHeader,
  AgreementFooter,
  DesktopFooter,
  AppContainer,
  AppHeader,
} from "@/components";
import { useEffect, useState } from "react";

const IdentityProfile = () => {
  const isDesktop = useResponsive();

  return (
    <AppContainer
      header={
        <AppHeader title="PROOF Identity Profile (PIP)" hasMute={false} />
      }
      body={
        !isDesktop ? (
          <div className="agreement-items-wrap">
            <Image
              className="get-started-img"
              src="/images/before-we-begin-mobile.svg"
              alt="image"
              width={3000}
              height={3000}
            />
            <p className="idd-title">
              Before we begin, PROOF will establish a secure PROOF Identity
              Profile for you.
            </p>
            <br />
            <p className="idd-txt with-bullet">
              Our process is simple, quick, and will be securely saved so that
              we can quickly identify you when you access the PROOF app. We will
              verify and match you to your valid Government ID (Driver`s license
              or Passport) and your mobile device.
            </p>
            <br /> <br />
            <p className="with-bullet">
              We do not sell nor share your information with outside parties.
            </p>
            <br />
            <p className="with-bullet">
              Click <span className="bold-headigs">`Next`</span> when you are
            </p>
            ready.
          </div>
        ) : (
          <div className="test-items-wrap-desktop_">
            <div className="sub-item">
              <div style={{ minHeight: "10px" }}>
                <p className="idd-title bold-headigs">
                  Before we begin, PROOF will establish a secure PROOF Identity
                  Profile for you.
                </p>
                <br />
                <p className="idd-txt">
                  Our process is simple, quick, and will be securely saved so
                  that we can quickly identify you when you access the PROOF
                  app. We will verify and match you to your valid Government ID
                  (Driver`s license or Passport) and your mobile device.
                  <br /> <br />
                  We do not sell nor share your information with outside
                  parties.
                  <br />
                  <br />
                  Click <span className="bold-headigs">Next</span> when you are
                  ready.
                </p>
              </div>
            </div>

            <div
              className="wrap-img"
              style={{ backgroundImage: "url('/images/id-before-begin.svg')" }}
            />
            {/* <Image
            className="get-started-img"
            src="/images/idv.svg"
            alt="image"
            width={3000}
            height={3000}
          /> */}
          </div>
        )
      }
      footer={
        <AgreementFooter
          currentNumber={3}
          outOf={4}
          onPagination={false}
          onLeftButton={false}
          onRightButton={true}
          btnLeftLink={""}
          btnRightLink={"/identity-profile/id-detection/step-1"}
          btnLeftText={"Decline"}
          btnRightText={"Next"}
        />
      }
    />
  );
};

export default IdentityProfile;
