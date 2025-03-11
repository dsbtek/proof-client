"use client";

import { useEffect, useState, useRef } from "react";

import "./timer.css";

interface TimerProps {
  time: number;
  showTimer: boolean;
  handleEnd(): void;
}

// const Timer = ({ time, showTimer, handleEnd }: TimerProps) => {
//   const [countdown, setCountdown] = useState<number>(time);
//   const timerId = useRef<NodeJS.Timeout | undefined>();
//   const [minutes, setMinutes] = useState<number>(
//     time % 60 === 0 ? time / 60 : 0
//   );
//   const [seconds, setSeconds] = useState<number>(time < 60 ? time : 0);

//   useEffect(() => {
//     if (showTimer) {
//       timerId.current = setInterval(() => {
//         setCountdown(countdown - 1);
//         if (seconds === 0 && minutes > 0) {
//           setSeconds(59);
//           setMinutes(minutes - 1);
//         } else {
//           setSeconds(seconds - 1);
//         }
//       }, 1000);
//     }

//     if (countdown <= 0) {
//       handleEnd();
//     }
//     return () => clearInterval(timerId.current);
//   }, [countdown, handleEnd, minutes, seconds, showTimer, time]);

//   useEffect(() => {
//     if (showTimer) {
//       timerId.current = setInterval(() => {
//         setCountdown((prevCountdown) => {
//           if (prevCountdown <= 1) {
//             clearInterval(timerId.current);
//             handleEnd();
//             return 0;
//           }
//           return prevCountdown - 1;
//         });

//         if (seconds === 0 && minutes > 0) {
//           setMinutes((prevMinutes) => prevMinutes - 1);
//           setSeconds(59);
//         } else {
//           setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
//         }
//       }, 1000);
//     }

//     return () => clearInterval(timerId.current);
//   }, [showTimer, handleEnd, minutes, seconds]);

//   return (
//     showTimer && (
//       <div className="timer-overlay">
//         <h1 className="timer-text">{`${
//           minutes < 10 ? "0" + minutes : minutes
//         }:${seconds < 10 ? "0" + seconds : seconds}`}</h1>
//       </div>
//     )
//   );
// };

interface TimerProps {
  time: number;
  showTimer: boolean;
  handleEnd: () => void;
}

const Timer = ({ time, showTimer, handleEnd }: TimerProps) => {
  const [countdown, setCountdown] = useState<number>(time);
  const timerId = useRef<NodeJS.Timeout | undefined>();
  const [minutes, setMinutes] = useState<number>(Math.floor(time / 60));
  const [seconds, setSeconds] = useState<number>(time % 60);

  // Progress ring properties
  const radius = 60;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (countdown / time) * circumference || circumference;

  useEffect(() => {
    console.log(
      strokeDashoffset,
      "stroke offset",
      circumference,
      "circumference"
    );
    if (showTimer) {
      timerId.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timerId.current);
            handleEnd();
            return 0;
          }
          return prevCountdown - 1;
        });

        if (seconds === 0 && minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }
      }, 1000);
    }

    return () => clearInterval(timerId.current);
  }, [showTimer, handleEnd, minutes, seconds]);

  // Format time as mm:ss
  const formatTime = () => {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ borderRadius: "900px", backgroundColor: "white" }}
      >
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00A1F1"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.35s",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            strokeLinecap: "round", // Rounded edges
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#00A1F1"
        >
          {formatTime()}
        </text>
      </svg>
    </div>
  );
};

export default Timer;
