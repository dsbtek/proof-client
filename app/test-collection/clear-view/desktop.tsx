"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  AgreementHeader,
  AppContainer,
  AppHeader,
  DesktopFooter,
  PipStepLoader,
} from "@/components";
import { appData, userIdString } from "@/redux/slices/appConfig";
import { useRouter } from "next/navigation";
import { testingKit } from "@/redux/slices/drugTest";

const Desktop = () => {
  const { permissions } = useSelector(appData);
  const userID = useSelector(userIdString);
  const appPermissions = permissions ? permissions.split(";") : undefined;
  const [identityPermission, setIdentityPermission] = useState("");
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const router = useRouter();
  const { kit_id, Scan_Kit_Label } = useSelector(testingKit);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };


  useEffect(() => {
    if (userID) {
      setLoaderVisible(true);
    }
    if (appPermissions && appPermissions.includes("PROOF_ID")) {
      setIdentityPermission("PROOF_ID");
    }
    if (appPermissions && appPermissions.includes("NO_ID")) {
      setIdentityPermission("NO_ID");
    }
  }, [appPermissions, userID]);

  // const handleLoaderClose = () => {
  //   setLoaderVisible(false);
  //   // router.push("/identity-profile/sample-facial-capture");
  //   // router.push("/identity-profile");
  //   router.push("/test-collection/rapid-test");
  // };

  return (
    <>
      <AppContainer
        header={<AppHeader title={"Confirmation"} hasMute={true}  onClickMute={toggleMute} muted={muted} />}
        body={
          <div className="test-items-wrap-desktop_">
            <div className="sub-item">
              <div style={{ minHeight: "10px" }}>
                <p className="get-started-title bold-headigs">Clear View</p>
                <p className="camera-view-text with-bullet">
                Using guide on the screen, please make sure your image and testing supplies are in the clear view of camera. Remember it is important to keep yourself, including your hands, and all testing supplies in full view of the camera at all the times.
                </p>
                <br />
                <br />
             
              </div>
            </div>
            <div
              className="wrap-img"
              style={{ backgroundImage: "url('/images/clear-view-d.svg')" }}
            />
            <audio ref={audioRef} src="/audio/begin_test.mp3" controls={false} muted={muted} autoPlay />
          </div>
        }
        footer={
          <DesktopFooter
            currentNumber={5}
            outOf={5}
            onPagination={true}
            onLeftButton={false}
            onRightButton={true}
            btnLeftLink={""}
            btnRightLink={`/test-collection/${kit_id}`
            }
            btnLeftText={"Decline"}
            btnRightText={"Next"}
          />
        }
      />
    </>
  );
};

export default Desktop;
