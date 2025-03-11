"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  AgreementHeader,
  AgreementFooter,
  AppContainer,
  AppHeader,
} from "@/components";

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
    <AppContainer
      header={<AppHeader title="PIP - Step 3" hasMute={false} />}
      body={
        sigCanvasH !== 700 ? (
          <div className="agreement-items-wrap">
            <Image
              className="get-started-img"
              src="/images/sample-facial-mobile.svg"
              alt="image"
              width={3000}
              height={3000}
            />
            <p className="idd-txt m-5 with-bullet">
              Next, we will conduct a facial recognition scan so that we may
              compare you to the photo that is shown on your Government ID.
              <br />
              <br />
            </p>
            <p className="with-bullet">
              The next time you login to your PROOF, your PIP will be securely
              saved and you will only need to complete the facial recognition
              step. This will speed up the process to verify your identity.
            </p>
            <br />
            <br />
            <p className="with-bullet">
              We do not sell nor share your information with the outside
              parties.
            </p>
            <br />
            <br />
            <p className="with-bullet">Click `Next` when you are ready.</p>
          </div>
        ) : (
          <div className="test-items-wrap-desktop_">
            <div className="sub-item">
              <div style={{ minHeight: "10px" }}>
                <h3>PIP - Step 3</h3>
                <br />
                <p className="idd-txt m-5 with-bullet">
                  Next, we will conduct a facial recognition scan so that we may
                  compare you to the photo that is shown on your Government ID.
                </p>
                <br />
                <br />
                <p className="with-bullet">
                  The next time you login to your PROOF, your PIP will be
                  securely saved and you will only need to complete the facial
                  recognition step. This will speed up the process to verify
                  your identity.
                </p>

                <br />
                <br />
                <p className="with-bullet">
                  We do not sell nor share your information with the outside
                  parties.
                </p>

                <br />
                <br />
                <p className="with-bullet">
                  Click <span className="bold-headigs">`Next`</span> when you
                  are ready.
                </p>
              </div>
            </div>
            <div
              className="wrap-img"
              style={{ backgroundImage: "url('/images/camera-view.svg')" }}
            />
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
          btnRightLink={"/identity-profile/facial-capture"}
          btnLeftText={"Decline"}
          btnRightText={"Next"}
        />
      }
    />
  );
};
export default SampleFacialCapture;
