"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CameraPermissionsOptions {
  showToast?: boolean;
}

export const useCameraPermissions = ({
  showToast = true,
}: CameraPermissionsOptions = {}) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      console.log("checkPermissions");

      try {
        // Check the permission status using navigator.permissions API (if supported)
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as any,
        });

        console.log(permissionStatus, "permissionStatus");

        if (permissionStatus?.state === "granted") {
          // Permission is already granted
          setPermissionsGranted(true);
        } else if (permissionStatus?.state === "prompt" || !permissionStatus) {
          // Permission is in the "prompt" state (or Permissions API is unsupported)
          console.log(permissionStatus, "permissionStatus");

          // Request the camera access
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setPermissionsGranted(true);
          stream.getTracks().forEach((track) => track.stop()); // Close the stream after obtaining the camera
        } else if (permissionStatus?.state === "denied") {
          // Permission is denied
          console.log("Permission denied. Informing user to enable manually.");

          // Show error message and instructions to enable camera access manually
          setPermissionError(
            "Camera access has been denied. Please enable it in your browser settings to continue."
          );
          if (showToast) {
            toast.error(
              "Camera access has been denied. Please enable it in your browser settings to continue."
            );
          }

          // Show instructions to help the user re-enable camera permissions
          showEnableCameraInstructions();
        } else {
          // Fallback if the permission API status is not recognized
          console.log("Unexpected permission status");
        }
      } catch (error) {
        console.log(error, "error");
        setPermissionError(
          "Error accessing camera. Please allow camera access to continue."
        );
        if (showToast) {
          toast.error(
            "Error accessing camera. Please allow camera access to continue."
          );
        }
      }
    };

    // Function to show instructions to the user on how to enable camera access
    const showEnableCameraInstructions = () => {
      alert(
        "Camera access has been denied. Please enable it in your browser settings:\n\n1. Click the lock icon next to the URL, or behind the URL.\n2. Under Permissions, change Camera to 'Allow'.\n3. Refresh the page to use the camera."
      );
    };

    // Only check permissions if they haven't been granted
    if (!permissionsGranted) {
      checkPermissions();
    }
  }, [permissionsGranted, showToast]);

  return { permissionsGranted, permissionError };
};
