// // src/SocketComponent.js
// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const SOCKET_SERVER_URL =
//   "https://f1b2f29c-82c6-48a1-8534-5817d5e08ffa.app.beam.cloud/main-id "; // Server URL

// const SocketComponent = () => {
//   const [socket, setSocket] = useState(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Connect to the socket server
//     const socketInstance = io(SOCKET_SERVER_URL);

//     // Save the socket instance
//     setSocket(socketInstance);

//     // Listen for messages from the server
//     socketInstance.on("message", (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     // Cleanup on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   // Handle message send
//   const sendMessage = () => {
//     if (message && socket) {
//       socket.emit("message", message); // Emit message to the server
//       setMessage("");
//     }
//   };

//   return (
//     <div>
//       <h2>Socket.io in React</h2>
//       <div>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter message"
//         />
//         <button onClick={sendMessage}>Send Message</button>
//       </div>

//       <div>
//         <h3>Messages:</h3>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index}>{msg}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SocketComponent;

import React, { RefObject, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

// "wss://proof-image-socket-9c08c36.app.beam.cloud"
const useSocketConnection = (
  socketUrl: string,
  cameraRef?: RefObject<Webcam>
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [response, setResponse] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    // Create a WebSocket connection to the server
    const ws: WebSocket = new WebSocket(socketUrl);

    // Event listener when WebSocket opens
    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to WebSocket server");
    };

    // Event listener when a message is received from the server
    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setResponse(event?.data);
    };

    // Event listener when WebSocket closes
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Save WebSocket instance in state
    setSocket(ws);

    console.log(ws, "ws");

    // Cleanup when the component unmounts
    return () => {
      ws.close();
    };
  }, [socketUrl]);

  const closeSocket = () => {
    return socket?.close;
  };

  // Send a message to the WebSocket server
  const sendMessage = (message: string) => {
    if (message && isConnected) {
      socket?.send(message); // Send message to server
    } else {
      console.log("socket not yet connected");
    }
  };

  // Start recording
  const startRecording = (
    setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const imageSrc = cameraRef?.current?.getScreenshot();
    setCapturedImage(imageSrc as string);

    if (cameraRef!.current?.video?.srcObject) {
      const videoStream = cameraRef!.current?.video?.srcObject as MediaStream;

      const mediaRecorder = new MediaRecorder(videoStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Push the video chunk to the array
          chunksRef.current.push(event.data);

          // Send the chunk to the WebSocket server
          if (isConnected) {
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              socket?.send(arrayBuffer);
            };
            reader.readAsArrayBuffer(event.data);
          }
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped");
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Start recording and collect data every 1 second
      setIsRecording(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // console.log(isConnected, response, "logs");
  return {
    isConnected,
    response,
    sendMessage,
    connecting: socket?.CONNECTING,
    closeSocket,
    startRecording,
    stopRecording,
  };
};

export default useSocketConnection;
