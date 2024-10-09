"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { AgreementHeader, AgreementFooter } from "@/components";

const SampleFacialCapture = () => {
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
      <AgreementHeader title="PIP - Step 3" />
      {sigCanvasH !== 700 ? (
        <div className="agreement-items-wrap">
          <Image
            className="get-started-img"
            src="/images/sample-facial-capture.svg"
            alt="image"
            width={3000}
            height={3000}
          />
          <p className="idd-txt m-5">
            Next, we will conduct a facial recognition scan so that we may
            compare you to the photo that is shown on your Government ID.
            <br />
            <br />
            The next time you login to your PROOF, your PIP will be securely
            saved and you will only need to complete the facial recognition
            step. This will speed up the process to verify your identity.
            <br />
            <br />
            We do not sell nor share your information with the outside parties.
            <br />
            <br />
            Click `Next` when you are ready.
          </p>
        </div>
      ) : (
        <div className="test-items-wrap-desktop_">
          <div className="sub-item">
            <p className="idd-txt m-5 bold-action-word">
              Next, we will conduct a facial recognition scan so that we may
              compare you to the photo that is shown on your Government ID.
              <br />
              <br />
              The next time you login to your PROOF, your PIP will be securely
              saved and you will only need to complete the facial recognition
              step. This will speed up the process to verify your identity.
              <br />
              <br />
              We do not sell nor share your information with the outside
              parties.
              <br />
              <br />
              Click <span className="bold-headigs">`Next`</span> when you are
              ready.
            </p>
          </div>
          <Image
            className="get-started-img"
            src="/images/pip3-dxtp.svg"
            alt="PIP 3"
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
        btnRightLink={"/identity-profile/facial-capture"}
        btnLeftText={"Decline"}
        btnRightText={"Next"}
      />
    </div>
  );
};
export default SampleFacialCapture;
