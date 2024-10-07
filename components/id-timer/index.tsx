"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Timer.module.css";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: { color: "green" },
  warning: { color: "orange", threshold: WARNING_THRESHOLD },
  alert: { color: "red", threshold: ALERT_THRESHOLD },
};

const TIME_LIMIT = 20;

const IdTimer: React.FC = () => {
  const [timePassed, setTimePassed] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [remainingPathColor, setRemainingPathColor] = useState<string>(
    COLOR_CODES.info.color
  );

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setTimePassed((prev) => {
        const updatedTime = prev + 1;
        setTimeLeft(TIME_LIMIT - updatedTime);
        return updatedTime;
      });
    }, 1000);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []); // Empty dependency array ensures it runs only once

  const calculateTimeFraction = useCallback((): number => {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }, [timeLeft]);

  const setCircleDasharray = useCallback((): void => {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    const pathRemaining = document.getElementById("base-timer-path-remaining");
    if (pathRemaining) {
      pathRemaining.setAttribute("stroke-dasharray", circleDasharray);
    }
  }, [calculateTimeFraction]);

  useEffect(() => {
    setCircleDasharray();
    updateRemainingPathColor(timeLeft);

    if (timeLeft === 0 && timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  }, [timeLeft, setCircleDasharray]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    let seconds: string | number = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${seconds}`;
  };

  const updateRemainingPathColor = (timeLeft: number): void => {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      setRemainingPathColor(alert.color);
    } else if (timeLeft <= warning.threshold) {
      setRemainingPathColor(warning.color);
    } else {
      setRemainingPathColor(info.color);
    }
  };

  return (
    <div className={styles.baseTimer}>
      <svg
        className={styles.baseTimerSvg}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={styles.baseTimerCircle}>
          <circle
            className={styles.baseTimerPathElapsed}
            cx="50"
            cy="50"
            r="45"
          ></circle>
          <path
            id="base-timer-path-remaining"
            strokeDasharray="283"
            className={`${styles.baseTimerPathRemaining} ${styles[remainingPathColor]}`}
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" className={styles.baseTimerLabel}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default IdTimer;
