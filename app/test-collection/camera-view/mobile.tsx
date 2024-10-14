"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AgreementHeader, AgreementFooter, PipStepLoader } from "@/components";
import { appData, userIdString } from "@/redux/slices/appConfig";
import { useRouter } from "next/navigation";

const Mobile = () => {
  const { permissions } = useSelector(appData);
  const userID = useSelector(userIdString);
  const appPermissions = permissions ? permissions.split(";") : undefined;
  const [identityPermission, setIdentityPermission] = useState('');
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userID) {
      setLoaderVisible(true)
    }
    if (appPermissions && appPermissions.includes("PROOF_ID")) {
      setIdentityPermission("PROOF_ID");
    }
    if (appPermissions && appPermissions.includes("NO_ID")) {
      setIdentityPermission("NO_ID");
    }
  }, [appPermissions, userID]);

  const handleLoaderClose = () => {
    setLoaderVisible(false);
    router.push("/identity-profile/sample-facial-capture");
  };

  return (
    <div className="container-test-collection">
      <PipStepLoader pipStep={2} isVisible={isLoaderVisible} onClose={handleLoaderClose} />

      <AgreementHeader title=" Camera View" />
      <div className="agreement-items-wrap">
        <Image className="get-started-img" src="/images/camera-view-1.svg" alt="image" width={3000} height={3000} />
        <p className="get-started-title">
          Camera View
        </p>
        <p className="camera-view-text">
          Proper Camera positioning, and attention during the test will be important for your collection. Please stay in the frame and ensure that you and your workspace are in clear view. Do not move your location or leave camera frame during your collection.
          <br />
          Press Next to continue.
        </p>
      </div>
      {/* <AgreementFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={"/identity-profile"} btnLeftText={"Decline"} btnRightText={"Next"} /> */}
      <AgreementFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={userID ? "/identity-profile/sample-facial-capture" : "/identity-profile"} btnLeftText={"Decline"} btnRightText={"Next"} />
    </div>
  );
};

export default Mobile;
