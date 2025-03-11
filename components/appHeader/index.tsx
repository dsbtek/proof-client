"use client";

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import styles from "./appHeader.module.css";
import { testData } from "@/redux/slices/drugTest";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";
import { appData } from "@/redux/slices/appConfig";
import useResponsive from "@/hooks/useResponsive";

interface AppHeaderProps {
  title: string;
  className?: string;
  onClickMute?: () => void;
  muted?: boolean;
  hasMute: boolean;
}

function AppHeader({
  title,
  className,
  onClickMute,
  muted = true,
  hasMute = true,
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { PROOF_Home_Logo } = useSelector(appData);
  const { testingKit } = useSelector(testData);
  const isDesktop = useResponsive();

  const handleBack = () => {
    if (pathname === "/test-collection/collection-summary") {
      router.push("/home");
    } else if (pathname === `/test-collection/${testingKit.kit_id}`) {
      toast.warn("You are taking a test. You can not go back");
    } else {
      router.back();
    }
  };

  const goHome = () => {
    router.push("/home");
  };

  return (
    <div className={styles.appHeaderContainer}>
      <div className={styles.routeHome}>
        <div className={styles.wrapHomeIcon} onClick={goHome}>
          <Image
            className={styles.btnDesktopImg}
            src="/icons/home-icon.svg"
            width={5000}
            height={5000}
            alt="List view icon"
            loading="lazy"
          />
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "400px",
              lineHeight: "14px",
              textWrap: "nowrap",
            }}
          >
            Go back to home
          </h3>
        </div>
        <Image
          className={styles.btnDesktopImg}
          src={PROOF_Home_Logo || "/icons/pr-home-icon.svg"}
          width={5000}
          height={5000}
          alt="List view icon"
          loading="lazy"
        />
      </div>
      <div className={styles.wrapSubHeader}>
        <div className={styles.iconContainer} onClick={handleBack}>
          <AiOutlineArrowLeft />
          &nbsp;{isDesktop && "Back"}
        </div>
        <div className={styles.titleContainer}>{title}</div>
        <div className={styles.audio_} onClick={onClickMute}>
          {hasMute ? (
            muted ? (
              <GoMute color="#adadad" style={{ cursor: "pointer" }} size={16} />
            ) : (
              <RxSpeakerLoud
                color="#009cf9"
                style={{ cursor: "pointer" }}
                size={16}
              />
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
