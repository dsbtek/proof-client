"use client";

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";

import "./appHeader.css";

interface AppHeaderProps {
    title: string;
}

function AppHeader({ title }: AppHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleBack = () => {
        if (pathname === "/test-collection/collection-summary") {
            router.push("/home");
        } else {
            router.back();
        }
    }

    return (
        <div className="app-header-container">
            <div className="icon-container">
                <AiOutlineArrowLeft onClick={handleBack} />
            </div>
            <div className="title-container">{title}</div>
        </div>
    )
};

export default AppHeader;