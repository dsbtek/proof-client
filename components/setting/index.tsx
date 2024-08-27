import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FiPhoneCall } from "react-icons/fi";
import Link from "next/link";

import "./setting.css";

interface SettingProps {
  title: string;
  icon?: React.ReactNode;
  link?: any;
  tel?: string;
  email?: string;
}

function Setting({ icon, title, link, tel, email }: SettingProps) {
  return tel ? (
    <Link className="set-con" href={`tel: ${tel}`}>
      <FiPhoneCall size={20} color="#009CF9" />
      <p className="set-text">{title}</p>
    </Link>
  ) : email ? (
    <Link className="set-con" href={`mailto: ${email}`}>
      <HiOutlineEnvelope size={20} color="#009CF9" />
      <p className="set-text">{title}</p>
    </Link>
  ) : (
    <Link className="setting" href={link}>
      <div className="set-con">
        {icon}
        <p className="set-text">{title}</p>
      </div>
      <div style={{ cursor: "pointer" }}>
        <AiOutlineRight color="#95A3B4" />
      </div>
    </Link>
  );
}

export default Setting;
