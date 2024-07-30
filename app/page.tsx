"use client";

import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';
import Cookies from "js-cookie";
import { useState } from "react";

import { HeaderText, Carousel, CheckBox } from "@/components";
import { setCookie } from "@/utils/utils";

function Welcome() {
  const welcomeCookie = Cookies.get("welView");
  const tokenCookie = Cookies.get("token");
  const [checked, setChecked] = useState(welcomeCookie === 'true' ? false : true);
  const handleSwitch = () => {
    if (welcomeCookie === 'false') {
      setCookie('welView', 'true', 2000);
      setChecked(false)
    } else {
      setCookie('welView', 'false', 2000);
      setChecked(true)
    }
  };

  return (
    <div className="container">
      <HeaderText title="Welcome" text='PROOF is a mobile solution that simplifies data management and facilitates customized testing programs. You have received an account to PROOF to perform one or more of the following tasks.' />
      <Carousel />
      <div className="qe-btn-cont">
        <CheckBox checked={checked} onChange={handleSwitch} label="Don`t show welcome screen again." />
        <Link href={tokenCookie !== undefined ? "/tutorial" : "/auth/sign-in"}>
          <button className="qe-btn"><IoIosArrowForward /></button>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;