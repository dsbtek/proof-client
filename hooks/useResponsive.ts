'use client';

import { useState, useLayoutEffect } from "react";

const useResponsive = (breakpoint = 700, debounceTime = 200) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    handleResize();

    let timeoutId: NodeJS.Timeout | undefined;

    const updateView = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceTime);
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
