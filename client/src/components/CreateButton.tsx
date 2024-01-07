import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

const CreateButton = () => {
  const { ws } = useContext(RoomContext);
  const joinRoom = () => {
    ws.emit("create-room");
  };
  return (
    <button
      onClick={joinRoom}
      className="border border-gray-300 rounded-lg py-2 px-4 hover:bg-blue-500 hover:text-white transition-all"
    >
      Start new meeting
    </button>
  );
};

export default CreateButton;
