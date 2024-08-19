"use client";

import { useState, useEffect } from "react";

const useResponsive = (breakpoint = 700, debounceTime = 200) => {
  const [isDesktop, setIsDesktop] = useState(() => {
    // Check if window is defined before accessing it
    return typeof window !== "undefined"
      ? window.innerWidth >= breakpoint
      : false;
  });

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window === "undefined") return;

    let timeoutId: string | number | NodeJS.Timeout | undefined;

    const updateView = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsDesktop(window.innerWidth >= breakpoint);
      }, debounceTime);
    };

    window.addEventListener("resize", updateView);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateView);
    };
  }, [breakpoint, debounceTime]);

  return isDesktop;
};

export default useResponsive;
