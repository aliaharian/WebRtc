import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
  roomId: string;
  peerId: string;
}
interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}
const rooms: Record<string, string[]> = {};
const chats: Record<string, IMessage[]> = {};

export function roomHandler(socket: Socket) {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("user created room!");
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    console.log("user joined room!", roomId);
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", {
        peerId,
      });
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
      socket.emit("get-messages", {
        roomId,
        messages: chats[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log(`user left the room ${peerId}`);
      leaveRoom({ peerId, roomId });
      socket.to(roomId).emit("user-disconnected", { peerId });
    });
  };
  const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
  };
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
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
}
