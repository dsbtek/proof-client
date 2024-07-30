'use client';

import React, { useEffect, useState } from 'react';
import MiniLoader from '../loaders/miniLoader';
import { useRouter } from 'next/navigation';
import Button from '../button';

interface ProgressBarProps {
    progress: number;
    onClick: () => void
}

const ProgressBar = ({ progress, onClick }: ProgressBarProps) => {
    const [result, setResult] = useState<boolean>(false);
    const router = useRouter();

    let message = '';

    if (progress === 0) {
        message = 'Warming Up';
    } else if (progress > 0 && progress < 100) {
        message = 'Keep Blowing';
    } else if (progress === 100) {
        message = 'Analyzing Results';
        setTimeout(() => {
            setResult(true)
        }, 3000);
    }


    return (
        <div className={'progressBarContainer'} onClick={onClick}>
            {!result && <p>{message}</p>}
            {result && <p>Results: 0.0000 BAC Negative</p>}
            {!result &&
                <div
                    className={'progressBar'}
                    style={{ backgroundImage: `url("/images/progress-ruler.svg")` }}
                >
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress === 100 &&
                            <MiniLoader />
                        }
                        {/* {progress}% */}
                    </div>
                </div>
            }
            {result &&
                <Button blue style={{ width: '292px', height: '44px' }} link='/home'>{"Continue"}</Button>
            }
        </div>
    );
};

export default ProgressBar;
