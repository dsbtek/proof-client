// hooks/useCameraPermissions.ts
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useCameraPermissions = () => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                setPermissionsGranted(true);
                stream.getTracks().forEach((track) => track.stop());
            } catch (error) {
                toast.error(
                    "Error accessing camera. Please allow camera access to continue."
                );
            }
        };

        checkPermissions();
    }, []);

    return permissionsGranted;
};