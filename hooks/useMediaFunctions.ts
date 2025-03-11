import { useEffect, useRef, useState } from "react";
export default function useMediaFunctions() {
  const [mimeType, setMimeType] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
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
    console.log("stopped");
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
  const onAIError = () => {
    console.log("AI Error");
    if (mediaRecorderRef.current) {
      const mediaRecorder = mediaRecorderRef.current;
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
        setStream(mediaStream);
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
          mediaRecorder.stop();
          mediaRecorder.start();
        }, 30000);
      })
      .catch((e) => console.log("error starting media recorder", e))
      .finally(() => setLoading(false));
  };

  interface MediaChunk {
    id: number;
    chunk: Blob;
    timestamp: number;
  }

  // Save each chunk to IndexedDB in real-time
  const saveChunkToIndexedDB = (chunk: Blob) => {
    const request = indexedDB.open("mediaDatabase", 1);

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result;
      const transaction = db.transaction(["mediaStore"], "readwrite");
      const objectStore = transaction.objectStore("mediaStore");

      const mediaFile: MediaChunk = {
        id: Date.now(),
        chunk,
        timestamp: Date.now(),
      };

      objectStore.add(mediaFile);
      console.log("Chunk saved to IndexedDB.");
    };

    request.onerror = (error: Event) => {
      console.error("Error saving chunk to IndexedDB", error);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBRequest).result;
      db.createObjectStore("mediaStore", { keyPath: "id" });
    };
  };

  const handleRequestData = () => {
    if (mediaRecorderRef.current) {
      console.log("request data");
      const mediaRecorder = mediaRecorderRef.current;
      intervalRef.current && clearInterval(intervalRef?.current);
      mediaRecorder.stop();
      mediaRecorder.start();
      intervalRef.current = setInterval(() => {
        console.log(mediaRecorder.state, "test");
        mediaRecorder.stop();
        mediaRecorder.start();
      }, 30000);
    }
  };

  return {
    mediaRecorderRef,
    videoRef,
    mimeType,
    startMediaRecorder,
    stopMediaRecorder,
    handleRequestData,
    onAIError,
    loading,
    stream,
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
