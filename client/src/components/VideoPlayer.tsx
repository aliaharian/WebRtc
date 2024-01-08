import { useContext, useEffect, useRef } from "react";
import { RoomContext } from "../context/RoomContext";

const VideoPlayer = ({ stream }: { stream?: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("stre", stream);
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay muted />;
};

export default VideoPlayer;
