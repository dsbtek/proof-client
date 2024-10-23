"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import { setCookie } from "@/utils/utils";

import WelcomeScreenDesktop from "./welcome-screen/desktop"
import WelcomeScreenMobile from "./welcome-screen/mobile"
import useResponsive from "@/hooks/useResponsive";

function Welcome() {
  const isDesktop = useResponsive();
  const welcomeCookie = Cookies.get("welView");
  const tokenCookie = Cookies.get("token");
  const [checked, setChecked] = useState(
    welcomeCookie === "true" ? false : true
  );

  const handleSwitch = () => {
    if (welcomeCookie === "false") {
      setCookie("welView", "true", 2000);
      setChecked(false);
    } else {
      setCookie("welView", "false", 2000);
      setChecked(true);
    }
  };

  return (
    <>
      {isDesktop ?
        <WelcomeScreenDesktop
          handleSwitch={handleSwitch}
          tokenCookie={tokenCookie}
          checked={checked}
        />
        :
        <WelcomeScreenMobile
          handleSwitch={handleSwitch}
          tokenCookie={tokenCookie}
          checked={checked} 
        />
      }

    </>
  );
}

export default Welcome;
