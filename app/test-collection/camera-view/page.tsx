"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AgreementHeader, AgreementFooter } from "@/components";
import { appData } from "@/redux/slices/appConfig";

const CameraView = () => {
  const { permissions, proof_id_value } = useSelector(appData);
  const user = useSelector(appData);
  const photo = user?.photo
  const appPermissions = permissions ? permissions.split(";") : undefined;
  const [identityPermission, setIdentityPermission] = useState('');
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
    window.addEventListener('resize', routeBasedOnScreenSize);
    return () => window.removeEventListener('resize', routeBasedOnScreenSize);
  }, []);

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
      {sigCanvasH !== 700 ?
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
        </div> :
        <div className="test-items-wrap-desktop_">
          <div className="sub-item">
            <p className="get-started-title">
              Camera View
            </p>
            <p className="camera-view-text">
              Proper Camera positioning, and attention during the test will be important for your collection. Please stay in the frame and ensure that you and your workspace are in clear view. Do not move your location or leave camera frame during your collection.
              <br />
              Press Next to continue.
            </p>
          </div>
          <Image className="get-started-img" src="/images/cview.svg" alt="image" width={3000} height={3000} />
        </div>
      }
      {/* <AgreementFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink={photo ? "/identity-profile/sample-facial-capture" : "/identity-profile"} btnLeftText={"Decline"} btnRightText={"Next"} /> */}
      <AgreementFooter currentNumber={5} outOf={5} onPagination={true} onLeftButton={false} onRightButton={true} btnLeftLink={""} btnRightLink="/identity-profile" btnLeftText={"Decline"} btnRightText={"Next"} />
    </div>
  );
};

export default CameraView;
