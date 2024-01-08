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
import { peersReducer } from "../reducers/peerReducer";
import {
  addAllPeersAction,
  addPeerAction,
  addPeerNameAction,
  changePeerNameAction,
  removePeerAction,
} from "../reducers/peerActions";
import { IMessage } from "../types/chat";
import { chatReducer } from "../reducers/chatReducer";
import {
  addHistoryAction,
  addMessageAction,
  toogleChatAction,
} from "../reducers/chatActions";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const ws = socketIO(WS);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") ?? ""
  );
  const [stream, setStream] = useState<MediaStream>();
  const [screenSharingId, setScreenSharingId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });
  console.log("peers", peers);
  useEffect(() => {
    localStorage.setItem("username", username);
    me && roomId && ws.emit("change-name", { peerId: me.id, username, roomId });
  }, [username, me, roomId]);
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`roomid is ${roomId}`);
    navigate(`room/${roomId}`);
  };
  const getUsers = ({ participants }: any) => {
    console.log("part", participants);
    dispatch(addAllPeersAction(participants));
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

  const sendMessage = (message: string) => {
    const messageData: IMessage = {
      content: message,
      author: me?.id,
      timestamp: new Date().getTime(),
    };
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", { roomId, messageData });
  };
  const addMessage = ({ messageData }: { messageData: IMessage }) => {
    console.log(messageData);
    chatDispatch(addMessageAction(messageData));
  };
  const toggleChat = () => {
    chatDispatch(toogleChatAction());
  };
  const addhistory = ({
    roomId,
    messages,
  }: {
    roomId: string;
    messages: IMessage[];
  }) => {
    console.log(messages);
    chatDispatch(addHistoryAction(messages || []));
  };
  const nameChanged = ({ peerId, username }: any) => {
    dispatch(changePeerNameAction(peerId, username));
  };
  useEffect(() => {
    const savedId = localStorage.getItem("userId");

    const meId = savedId ?? uuidV4();
    localStorage.setItem("userId", meId);
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
    ws.on("user-started-sharing", ({ peerId }: { peerId: string }) =>
      setScreenSharingId(peerId)
    );
    ws.on("user-stopped-sharing", () => {
      setScreenSharingId(undefined);
    });
    ws.on("add-message", addMessage);
    ws.on("get-messages", addhistory);
    ws.on("name-changed", nameChanged);

    return () => {
      ws.offAny();
    };
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId, username: peerUsername }: any) => {
      // setTimeout(() => {
      console.log(`i am calling ${peerId}`);
      dispatch(addPeerNameAction(peerId, peerUsername));
      const call = me.call(peerId, stream, {
        metadata: {
          username,
        },
      });
      //i am calling peer
      call.on("stream", (peerStream) => {
        console.log(`${peerId} answered!`);
        dispatch(addPeerAction(peerId, peerStream));
      });
      // }, 1000);
    });
    console.log("here is ok !", me);
    me.on("call", (call) => {
      const { username } = call.metadata;
      dispatch(addPeerNameAction(call.peer, username));
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

  return (
    <RoomContext.Provider
      value={{
        ws,
        me,
        stream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        sendMessage,
        toggleChat,
        chat,
        username,
        setUsername,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
