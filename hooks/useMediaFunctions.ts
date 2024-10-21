import { useEffect, useRef, useState } from "react";
export default function useMediaFunctions() {
  const [mimeType, setMimeType] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const types = ["video/webm", "video/mp4"];
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    for (const type of types) {
      const isSupported = MediaRecorder.isTypeSupported(type);
      if (isSupported) {
        if (type === "video/mp4") {
          setMimeType("video/mp4; codecs=avc1.64001e, mp4a.40.2");
        } else {
          // "video/webm;codecs=vp8,opus"
          setMimeType("video/mp4; codecs=avc1.64001e, mp4a.40.2");
        }

        // setMimeType(type);
        break;
      }
    }
  }, []);
  const stopMediaRecorder = () => {
    if (mediaRecorderRef.current) {
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop();
      });
      mediaRecorder.stop();
      mediaRecorder.ondataavailable = null;
      intervalRef.current && clearInterval(intervalRef?.current);
    }
  };

  const startMediaRecorder = async () => {
    setLoading(true);
    // Check if the stream already has an audio track, if not, add one
    await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((mediaStream) => {
        let test = "";
        for (const type of types) {
          const isSupported = MediaRecorder.isTypeSupported(type);
          if (isSupported) {
            if (type === "video/mp4") {
              test = "video/mp4; codecs=avc1.64001e, mp4a.40.2";
            } else {
              // "video/webm;codecs=vp8,opus"
              test = "video/mp4; codecs=avc1.64001e, mp4a.40.2";
            }
            // setMimeType(type);
            break;
          }
        }

        console.log("mimeType", test);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        mediaRecorderRef.current = new MediaRecorder(mediaStream, {
          mimeType: test,
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000,
        });
        return mediaRecorderRef.current;
      })
      .then((mediaRecorder) => {
        mediaRecorder?.start();
        intervalRef.current = setInterval(() => {
          console.log(mediaRecorder.state, "test");
          handleRequestData();
        }, 30000);
      })
      .catch((e) => console.log("error starting media recorder", e))
      .finally(() => setLoading(false));
  };
  const handleRequestData = () => {
    if (mediaRecorderRef.current) {
      console.log("request data");
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.stop();
      mediaRecorder.start();
    }
  };
  return {
    mediaRecorderRef,
    videoRef,
    mimeType,
    startMediaRecorder,
    stopMediaRecorder,
    handleRequestData,
    loading,
  };
}
// const handleDownload = (recordedChunks: any) => {
//     const blob = new Blob([recordedChunks], { type: "video/webm" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "recording.webm";
//     a.click();
//     URL.revokeObjectURL(url);
//   };
