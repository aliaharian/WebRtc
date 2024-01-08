import Peer from "peerjs";
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const ws = socketIO(WS);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenSharingId, setScreenSharingId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`roomid is ${roomId}`);
    navigate(`room/${roomId}`);
  };
  const getUsers = ({ participants }: any) => {
    console.log("part", participants);
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          setStream(stream);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const removePeer = ({ peerId }: { peerId: string }) => {
    dispatch(removePeerAction(peerId));
  };
  const shareScreen = () => {
    if (screenSharingId) {
      stream?.getTracks().forEach((track) => track.stop());
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
    }
  };
  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(screenSharingId ? undefined : me?.id || "");
    Object.values(me?.connections || {}).forEach((connection: any) => {
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection?.[0]?.peerConnection
        ?.getSenders()[1]
        ?.replaceTrack(videoTrack)
        .catch((error: any) => console.log(error));
    });
  };

  useEffect(() => {
    const meId = uuidV4();
    // const peer = new Peer(meId, {
    //   host: "peerjs.aliaharian.ir",
    //   port: 443,
    //   secure:true,
    //   path: "/myapp",
    // });
    const peer = new Peer(meId, {
      host: "localhost",
      port: 9500,
      path: "/",
    });
    setMe(peer);

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", ({ peerId }: { peerId: string }) =>
      setScreenSharingId(peerId)
    );
    ws.on("user-stopped-sharing", () => {
      setScreenSharingId(undefined);
    });

    return () => {
      ws.offAny();
    };
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId }: any) => {
      setTimeout(() => {
        console.log(`i am calling ${peerId}`);
        const call = me.call(peerId, stream);
        //i am calling peer
        call.on("stream", (peerStream) => {
          console.log(`${peerId} answered!`);
          dispatch(addPeerAction(peerId, peerStream));
        });
      }, 1000);
    });
    console.log("here is ok !", me);
    me.on("call", (call) => {
      console.log(`someone is calling!`);
      console.log(`i am going to answer!`);
      call.answer(stream);
      //peer calling me and i answer
      call.on("stream", (peerStream) => {
        console.log(`${call.peer} recieved my answer!`);

        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
    stream.getVideoTracks()[0].onended = function () {
      shareScreen();
    };
  }, [me, stream]);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing", { roomId });
    }
  }, [screenSharingId]);

  console.log("peers", peers);
  return (
    <RoomContext.Provider
      value={{ ws, me, stream, peers, shareScreen, screenSharingId, setRoomId }}
    >
      {children}
    </RoomContext.Provider>
  );
};
