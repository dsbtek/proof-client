"use client";

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { AppHeader, Button, MiniLoader } from '@/components';
import { testData } from '@/redux/slices/drugTest';
import { appData } from '@/redux/slices/appConfig';
import Mobile from "./mobile"
import Desktop from "./desktop"
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";


function CollectionSummary() {
    const router = useRouter();
    const pathname = usePathname();
    const { startTime, endTime, testClip, uploading, confirmationNo } = useSelector(testData);
    const { Shipping_Carrier } = useSelector(appData);
    const device = useGetDeviceInfo();

    const exitAndSave = () => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = testClip;
        a.download = "proof-capture1.mp4";
        a.click();

        router.push('/home');
    };

    useEffect(() => {
        function beforeUnloadHandler(event: BeforeUnloadEvent) {
            event.preventDefault();
            toast('Please wait for the video to finish uploading', { autoClose: 5000 });
        }

        if (uploading === true && pathname === '/test-collection/collection-summary') {
            window.addEventListener('beforeunload', beforeUnloadHandler);
        }

        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [uploading, pathname]);

    return device?.screenWidth > 700 ? <Desktop /> : <Mobile />;
}

export default CollectionSummary;
