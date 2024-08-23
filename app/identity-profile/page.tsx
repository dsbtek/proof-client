"use client";
import Image from "next/image";

import { AgreementHeader, AgreementFooter, DesktopFooter } from "@/components";
import { useEffect, useState } from "react";

const IdentityProfile = () => {
  const [sigCanvasH, setSigCanvasH] = useState(0);

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 700) {
        setSigCanvasH(250);
      } else {
        setSigCanvasH(700);
      }
    };
    routeBasedOnScreenSize();
    window.addEventListener("resize", routeBasedOnScreenSize);
    return () => window.removeEventListener("resize", routeBasedOnScreenSize);
  }, []);
  return (
    <div className="container-test-collection">
      <AgreementHeader title="PROOF Identity Profile (PIP)" />
      {sigCanvasH !== 700 ? (
        <div className="agreement-items-wrap">
          <Image
            className="get-started-img"
            src="/images/proof-identity-profile.svg"
            alt="image"
            width={3000}
            height={3000}
          />
          <p className="idd-title">
            Before we begin, PROOF will establish a secure PROOF Identity
            Profile for you.
          </p>
          <br />
          <p className="idd-txt">
            Our process is simple, quick, and will be securely saved so that we
            can quickly identify you when you access the PROOF app. We will
            verify and match you to your valid Government ID (Driver`s license
            or Passport) and your mobile device.
            <br /> <br />
            We do not sell nor share your information with outside parties.
            <br />
            Click `Next` when you are ready.
          </p>
        </div>
      ) : (
        <div className="test-items-wrap-desktop_">
          <div className="sub-item">
            <p className="idd-title">
              Before we begin, PROOF will establish a secure PROOF Identity
              Profile for you.
            </p>
            <br />
            <p className="idd-txt">
              Our process is simple, quick, and will be securely saved so that
              we can quickly identify you when you access the PROOF app. We will
              verify and match you to your valid Government ID (Driver`s license
              or Passport) and your mobile device.
              <br /> <br />
              We do not sell nor share your information with outside parties.
              <br />
              Click `Next` when you are ready.
            </p>
          </div>
          <Image
            className="get-started-img"
            src="/images/idv.svg"
            alt="image"
            width={3000}
            height={3000}
          />
        </div>
      )}
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
    </div>
  );
};

export default IdentityProfile;
