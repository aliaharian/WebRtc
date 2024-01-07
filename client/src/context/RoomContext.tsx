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
  const [peers, dispatch] = useReducer(peersReducer, {});
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`roomid is ${roomId}`);
    navigate(`room/${roomId}`);
  };
  const getUsers = ({ participants }: any) => {
    console.log("part", participants);
  };
  const removePeer = ({ peerId }: { peerId: string }) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          setStream(stream);
        });
    } catch (e) {
      console.log(e);
    }
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId }: any) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });
    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log("peers", peers);
  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};
