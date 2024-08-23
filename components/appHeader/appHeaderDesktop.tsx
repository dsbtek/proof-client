"use client";

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowLeft, AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import "./appHeader.css";
import { testData } from "@/redux/slices/drugTest";
import { useState } from "react";

interface AppHeaderDesktopProps {
    title: string;
    className?: string;
    handleDialog?: () => void;
}

function AppHeaderDesktop({ title, className, handleDialog }: AppHeaderDesktopProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { testingKit } = useSelector(testData);
    const [navPath] = useState(`/test-collection/${testingKit.kit_id}`);

    const handleBack = () => {
        const isSummaryPage = pathname === "/test-collection/collection-summary";
        const isTestCollectionPage = pathname.includes(`/test-collection/${testingKit.kit_id}`);
        if (isSummaryPage) {
            router.push("/home");
        } else if (isTestCollectionPage) {
            toast.warn('You are taking a test. You cannot go back');
        } else {
            router.back();
        }
    };

    const renderIcon = () => {
        if (pathname !== `${navPath}` || "/test-collection/collection-summary") {
            return (
                <div className="cancel-btn" onClick={handleDialog}>
                    <p> Cancel</p>
                    <AiFillCloseCircle
                        color="red"
                        onClick={handleDialog}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            );
        } else {
            return (
                <AiOutlineArrowLeft
                    onClick={handleBack}
                    style={{ cursor: "pointer" }}
                />
            );
        }
    };

    return (
        <div className={`app-header-container ${className}`}>
            <div className="icon-container">
                {renderIcon()}
            </div>
            <div className="title-container">{title}</div>
        </div>
    );
}

export default AppHeaderDesktop;
