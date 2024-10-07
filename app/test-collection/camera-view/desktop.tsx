"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AgreementHeader, DesktopFooter } from "@/components";
import { appData, userIdString } from "@/redux/slices/appConfig";

const Desktop = () => {
  const { permissions } = useSelector(appData);
  const userID = useSelector(userIdString);
  const appPermissions = permissions ? permissions.split(";") : undefined;
  const [identityPermission, setIdentityPermission] = useState('');


  useEffect(() => {
    if (appPermissions && appPermissions.includes("PROOF_ID")) {
      setIdentityPermission("PROOF_ID");
    }
    if (appPermissions && appPermissions.includes("NO_ID")) {
      setIdentityPermission("NO_ID");
    }
  }, [appPermissions]);

  return (
    <div className="container-test-collection">
      <AgreementHeader title=" Camera View" />
      <div className="test-items-wrap-desktop_">
        <div className="sub-item">
          <p className="get-started-title bold-headigs">
            Camera View
          </p>
          <p className="camera-view-text">
            Proper Camera positioning, and attention during the test will be important for your collection. Please stay in the frame and ensure that you and your workspace are in clear view. Do not move your location or leave camera frame during your collection.
            <br /><br />
            Press <span className="bold-headigs">Next</span> to continue.
          </p>
        </div>
        <Image className="get-started-img" src="/images/cview.svg" alt="image" width={3000} height={3000} />
      </div>
      {/* <DesktopFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/test-collection/a0q2J00000BM9IDQA1"} btnLeftText={"Decline"} btnRightText={"Next"} /> */}
      {/* <DesktopFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/identity-profile"} btnLeftText={"Decline"} btnRightText={"Next"} /> */}
      <DesktopFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={userID ? "/identity-profile/sample-facial-capture" : "/identity-profile"} btnLeftText={"Decline"} btnRightText={"Next"} />
    </div>
  );
};

export default Desktop;
