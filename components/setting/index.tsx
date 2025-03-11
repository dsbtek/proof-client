import React, { useMemo } from "react";
import { AiOutlineRight } from "react-icons/ai";
import {
  HiArrowRight,
  HiArrowUpRight,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { FiPhoneCall } from "react-icons/fi";
import Link from "next/link";

import "./setting.css";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import Image from "next/image";

interface SettingProps {
  title: string;
  icon?: React.ReactNode;
  link?: any;
  tel?: string;
  email?: string;
  openInNewTab?: boolean;
}

function Setting({
  icon,
  title,
  link,
  tel,
  email,
  openInNewTab,
}: SettingProps) {
  const device = useGetDeviceInfo();
  const isDesktop = useMemo(() => device?.screenWidth > 700, [device]);
  return tel ? (
    <Link className="set-con" href={`tel: ${tel}`}>
      {/* <FiPhoneCall size={20} color={isDesktop ? "#009CF9" : "#009CF9"} /> */}
      <Image
        className="dex-only"
        src="/icons/tel.svg"
        alt="inbox"
        width={20}
        height={20}
        loading="lazy"
      />
      <p className="set-text">{title}</p>
    </Link>
  ) : email ? (
    <Link className="set-con" href={`mailto: ${email}`}>
      <Image
        className="dex-only"
        src="/icons/msg.svg"
        alt="inbox"
        width={20}
        height={20}
        loading="lazy"
      />
      <HiOutlineEnvelope size={20} color="#009CF9" className="mobile-only" />
      <p className="set-text">{title}</p>
    </Link>
  ) : (
    <Link
      className="setting"
      href={link}
      target={openInNewTab ? "_blank" : "_self"}
    >
      <div className="set-con">
        {icon}
        <p className="set-text">{title}</p>
      </div>
      {/* <div style={{ cursor: "pointer" }}>
        {isDesktop ? (
          openInNewTab ? (
            <HiArrowUpRight />
          ) : (
            <HiArrowRight />
          )
        ) : (
          <AiOutlineRight color="#95A3B4" />
        )}
      </div> */}
    </Link>
  );
}

export default Setting;
