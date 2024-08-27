"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AgreementHeader, AgreementFooter, DesktopFooter } from "@/components";
import { appData } from "@/redux/slices/appConfig";
import useResponsive from "@/hooks/useResponsive";
import Mobile from "./mobile"
import Desktop from "./desktop"

const CameraView = () => {
  const { permissions, proof_id_value } = useSelector(appData);
  const user = useSelector(appData);
  const appPermissions = permissions ? permissions.split(";") : undefined;
  const [identityPermission, setIdentityPermission] = useState('');
  const isDesktop = useResponsive()

  useEffect(() => {
    if (appPermissions && appPermissions.includes("PROOF_ID")) {
      setIdentityPermission("PROOF_ID");
    }
    if (appPermissions && appPermissions.includes("NO_ID")) {
      setIdentityPermission("NO_ID");
    }
  }, [appPermissions]);

  return isDesktop ? <Desktop /> : <Mobile />;
};

export default CameraView;
