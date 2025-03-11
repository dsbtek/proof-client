"use client";

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import styles from "./appHeader.module.css";
import { testData } from "@/redux/slices/drugTest";
import { IoIosArrowBack } from "react-icons/io";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import { useState } from "react";

interface AppHeaderProps {
  title: string;
  className?: string;
  icon1: JSX.Element;
  icon2?: JSX.Element;
  onClickMute?: () => void;
  muted?: boolean;
  hasMute: boolean;
  handleDialog?: () => void;
  toggleScan?: () => void;
}

const Header = ({
  title,
  className,
  icon1,
  icon2,
  onClickMute,
  muted,
  hasMute,
  handleDialog,
  toggleScan,
}: AppHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { testingKit } = useSelector(testData);
  const isTestCollectionPg = pathname === "/test-collection";
  const handleBack = () => {
    if (pathname === "/test-collection/collection-summary") {
      router.push("/home");
    } else if (pathname === `/test-collection/${testingKit.kit_id}`) {
      toast.warn("You are taking a test. You cannot go back");
    } else {
      router.back();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "10px",
        padding: "0 8px",
      }}
    >
      <div
        className={styles.iconContainer_}
        onClick={
          pathname !== `/test-collection/${testingKit.kit_id}`
            ? handleBack
            : handleDialog
        }
      >
        {icon1}{" "}
        {/*pathname !== `/test-collection/${testingKit.kit_id}` && <p>Go back</p>*/}
      </div>
      <div className={styles.iconContainer}>{title}</div>
      <div onClick={onClickMute}>
        {icon2}
        {hasMute ? (
          muted ? (
            <GoMute color="#adadad" style={{ cursor: "pointer" }} size={18} />
          ) : (
            <RxSpeakerLoud
              color="#009cf9"
              style={{ cursor: "pointer" }}
              size={18}
            />
          )
        ) : (
          isTestCollectionPg && (
            <Image
              onClick={toggleScan}
              className="desktop-scan-icon"
              src={"/icons/scan-icon.png"}
              alt="proof image"
              width={3000}
              height={3000}
              loading="lazy"
            />
          )
        )}
      </div>
    </div>
  );
};

export default Header;
