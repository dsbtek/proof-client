"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { authToken } from "@/redux/slices/auth";

import { SessionModal } from '@/components';
import { setCookie } from "@/utils/utils";
import { testData } from "@/redux/slices/drugTest";
import { testingKit } from '../../redux/slices/drugTest';

function Auth({ children }: Readonly<{ children: React.ReactNode }>) {
    const { token, participant_id, pin, loggedOut } = useSelector(authToken);
    const { testingKit } = useSelector(testData);
    const router = useRouter();
    const pathname = usePathname();
    const tokenCookie = Cookies.get("token");
    const landingCookie = Cookies.get("welView");

    const [showSessionModal, setShowSessionmodal] = useState(false);

    const stayLoggedIn = () => {
        setShowSessionmodal(false);
        setCookie('token', 'true', 1 / 24);
    }

    const handleSessionModal = useCallback(() => {
        setShowSessionmodal(false);
        toast.warning("Session expired! Please login again");
        router.push("/auth/sign-in");
    }, [router]);


    useEffect(() => {
        // Checks if the user is logged in and the token is valid
        if (pathname !== "/" && pathname !== "/auth/forgot-pin" && pathname !== "/auth/enter-otp" && pathname !== "/auth/set-new-pin" && pathname !== "/auth/sign-in" && pathname !== "/new-to-proof" && tokenCookie === undefined && token === false) {
            !loggedOut ? toast.warning("Invalid Session! Please login again") : null;
            router.push("/auth/sign-in");
        } else if (pathname === "/auth/sign-in" && token === true && tokenCookie === "true") {
            landingCookie !== undefined && landingCookie === 'true' ? router.push("/") : router.push("/home");
        } else if (pathname !== "/auth/sign-up" && token === true && tokenCookie === "true") {
            router.push(pathname);
        }

        //Checks if the user reloads the page
        if (pathname !== "/" && pathname !== "/auth/forgot-pin" && pathname !== "/auth/enter-otp" && pathname !== "/auth/set-new-pin" && pathname !== "/auth/sign-in" && participant_id === 0 && tokenCookie === "true") {
            toast.error("Session Invalidated! Please login again.");
            toast.warning("Do not reload the page! Or use the back button!");
            Cookies.remove("token");
            router.push("/auth/sign-in");
        }

        //Checks if the user's session has expired
        if (pathname !== "/" && pathname !== "/auth/forgot-pin" && pathname !== "/auth/enter-otp" && pathname !== "/auth/set-new-pin" && pathname !== "/auth/sign-in" && participant_id !== 0 && tokenCookie === undefined) {
            if (pathname === `/test-collection/${testingKit.kit_id}` || pathname === '/test-collection/collection-summary') {
                setShowSessionmodal(true);
            } else {
                toast.warning("Session expired! Please login again");
                router.push("/auth/sign-in");
            }
        }
    }, [pathname, token, router, tokenCookie, participant_id, pin, landingCookie, loggedOut, testingKit]);

    return <>
        <SessionModal show={showSessionModal} handleEnd={handleSessionModal} onClick={stayLoggedIn} />
        {children}
    </>;
}

export default Auth;
