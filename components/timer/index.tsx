"use client";

import { useEffect, useState, useRef } from 'react'

import './timer.css';

interface TimerProps {
    time: number;
    showTimer: boolean;
    handleEnd(): void
}

const Timer = ({ time, showTimer, handleEnd }: TimerProps) => {
    const [countdown, setCountdown] = useState<number>(time);
    const timerId = useRef<NodeJS.Timeout | undefined>()
    const [minutes, setMinutes] = useState<number>(time % 60 === 0 ? time / 60 : 0);
    const [seconds, setSeconds] = useState<number>(time < 60 ? time : 0);


    useEffect(() => {
        if (showTimer) {
            timerId.current = setInterval(() => {
                setCountdown(countdown - 1);
                if (seconds === 0 && minutes > 0) {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000)
        }

        if (countdown <= 0) {
            handleEnd();
        }
        return () => clearInterval(timerId.current);
    }, [countdown, handleEnd, minutes, seconds, showTimer, time]);

    return (
        showTimer && <div className='timer-overlay'>
            <h1 className='timer-text'>{`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}</h1>
        </div>
    )
};

export default Timer;