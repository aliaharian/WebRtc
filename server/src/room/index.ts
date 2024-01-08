import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
  roomId: string;
  peerId: string;
}
interface IJoinRoomParams extends IRoomParams {
  username: string;
}
interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}
interface IUser {
  peerId: string;
  username: string;
}
const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};

export function roomHandler(socket: Socket) {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created room!");
  };

  const joinRoom = ({ roomId, peerId, username }: IJoinRoomParams) => {
    console.log("user joined room!", roomId, username);
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];

    rooms[roomId][peerId] = { peerId, username };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", {
      peerId,
      username,
    });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });
    socket.emit("get-messages", {
      roomId,
      messages: chats[roomId],
    });

    socket.on("disconnect", () => {
      console.log(`user left the room ${peerId}`);
      // leaveRoom({ peerId, roomId });
      socket.to(roomId).emit("user-disconnected", { peerId });
    });
  };
  // const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
  // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
  // };
  const startSharing = ({ peerId, roomId }: IRoomParams) => {
    socket.to(roomId).emit("user-started-sharing", { peerId });
  };
  const stopSharing = ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };
  const addMessage = ({
    roomId,
    messageData,
  }: {
    roomId: string;
    messageData: IMessage;
  }) => {
    if (chats[roomId]) {
      chats[roomId].push(messageData);
    } else {
      chats[roomId] = [messageData];
    }
    socket.to(roomId).emit("add-message", { messageData });
  };
  const changeName = ({
    peerId,
    username,
    roomId,
  }: {
    peerId: string;
    username: string;
    roomId: string;
  }) => {
    rooms[roomId][peerId].username = username;
    socket.to(roomId).emit("name-changed", {
      peerId,
      username,
      roomId,
    });
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
}
