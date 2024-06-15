"use client";

import React from "react";
import Image from "next/image";

import { AgreementHeader, AgreementFooter } from "@/components";

const SampleFacialCapture = () => {
  return (
    <div className="container-test-collection">
      <AgreementHeader title="PIP - Step 3" />
      <div className="agreement-items-wrap">
        <Image className="get-started-img" src="/images/sample-face-capture.png" alt="image" width={3000} height={3000} />
        <p className="idd-txt m-5">
          Next, we will conduct a facial recognition scan so that we may compare you to the photo that is shown on your Government ID.
          <br />
          <br />
          The next time you login to your PROOF, your PIP will be securely saved and you will only need to complete the facial recognition step. This will speed up the process to verify your identity.
          <br />
          <br />
          We do not sell nor share your information with the outside parties.
          <br />
          <br />
          Click `Next` when you are ready.
        </p>
      </div>
      <AgreementFooter currentNumber={3} outOf={4} onPagination={false} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/identity-profile/facial-capture"} btnLeftText={"Decline"} btnRightText={"Next"} />
    </div>
  );
};
export default SampleFacialCapture;
