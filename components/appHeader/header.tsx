"use client";

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import "./appHeader.css";
import { testData } from "@/redux/slices/drugTest";

interface AppHeaderProps {
    title: string;
    className?: string;
    icon?: JSX.Element;
}

const Header = ({ title, className, icon }: AppHeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { testingKit } = useSelector(testData);

    const handleBack = () => {
        if (pathname === "/test-collection/collection-summary") {
            router.push("/home");
        } else if (pathname === `/test-collection/${testingKit.kit_id}`) {
            toast.warn("You are taking a test. You cannot go back");
        } else {
            router.back();
        }
    };

    return (
        <div className={`app-header-container ${className}`}>
            <div className="icon-container">
                <AiOutlineArrowLeft onClick={handleBack} />
            </div>
            <div className="icon-container">{title}</div>
            {icon}
        </div>
    );
};

export default Header;