"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './pipLoader.css';

interface IPipLoader {
    pipStep: number;
    isVisible: boolean;
    onClose?: () => void;
}

const PipLoader = ({ pipStep, isVisible, onClose }: IPipLoader) => {
    const [progress, setProgress] = useState(0);
    const [loaderData] = useState([
        { id: 1, desc: "Face Extraction, please wait...", img: "/icons/face-extraction-loader.svg" },
        { id: 2, desc: "Face Comparison, please wait....", img: "/icons/facial-comparison-loader.svg" },
        { id: 3, desc: "Face Processing, please wait....", img: "/icons/face-processing-loader.svg" }
    ]);

    useEffect(() => {
        if (isVisible) {
            // Reset progress when the loader becomes visible
            setProgress(0);

            // Start the progress bar animation
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = prevProgress + 1;
                    return newProgress <= 100 ? newProgress : 100;
                });
            }, 100); // Increase progress by 1% every 100ms (10 seconds total)

            // Cleanup interval on component unmount or when isVisible changes
            return () => clearInterval(interval);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            // Set a timer to hide the loader after 10 seconds
            const timer = setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 10000); // 10 seconds

            // Cleanup timer on component unmount or when isVisible changes
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    // Get the current loader data based on pipStep
    const currentLoaderData = loaderData.find(data => data.id === pipStep) || loaderData[0];

    return (
        <div className="pip-loader-bg">
            <div className="pip-loader">
                <Image
                    src={currentLoaderData.img} // Dynamically display the image based on pipStep
                    alt="Loader Icon"
                    className="pip-loader-icon"
                    width={5000}
                    height={5000}
                    loading="lazy"
                />
                <p>{currentLoaderData.desc}</p> {/* Dynamically display the description */}
                <div className="progress-bar">
                    <div
                        className="progress-level"
                        style={{ width: `${progress}%` }} // Set width based on progress
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PipLoader;
