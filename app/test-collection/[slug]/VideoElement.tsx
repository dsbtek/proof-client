import Image from "next/image";
import React, { forwardRef, useEffect } from "react";

interface VideoElementProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  stream?: MediaStream | null; // Adding stream as a prop
  faceDetected?: boolean;
}

const frameStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  overflow: "hidden",
};

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(
  (props, ref) => {
    const { stream, faceDetected, ...rest } = props;

    // Set the stream to srcObject using ref after the component mounts
    useEffect(() => {
      if (ref && "current" in ref && ref.current && stream) {
        (ref.current as HTMLVideoElement).srcObject = stream;
      }
    }, [stream, ref]); // Update when stream changes

    return (
      <div
        className="test-camera-container"
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexGrow: 1,
          ...rest.style,
        }}
      >
        <video
          ref={ref}
          {...rest}
          className="test-camera-container"
          style={{
            display: "flex",
            objectFit: "cover",
            flexGrow: 1,
            backgroundColor: "black",
          }}
        />
        <div style={frameStyle as any}>
          {faceDetected ? (
            <Image
              className="detection-image"
              src="/images/face-detected-green.png"
              alt="captured Image"
              width={2000}
              height={2000}
            />
          ) : (
            <Image
              className="detection-image"
              src="/images/face-no-detected-red.png"
              alt="captured Image"
              width={2000}
              height={2000}
            />
          )}
        </div>
      </div>
    );
  }
);

VideoElement.displayName = "VideoElement"; // Fixes the ESLint warning

export default VideoElement;
