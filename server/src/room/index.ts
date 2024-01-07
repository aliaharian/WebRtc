import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
  roomId: string;
  peerId: string;
}
const rooms: Record<string, string[]> = {};

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
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
}
