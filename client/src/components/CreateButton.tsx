import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import NameInput from "../common/NameInput";

const CreateButton = () => {
  const { ws } = useContext(RoomContext);
  const joinRoom = () => {
    ws.emit("create-room");
  };
  return (
    <div className="flex flex-col">
      <NameInput />
      <button
        onClick={joinRoom}
        className="border border-blue-700  text-white rounded-lg py-2 px-4 bg-blue-500 hover:bg-blue-700 hover:text-white transition-all"
      >
        Start new meeting
      </button>
    </div>
  );
};

export default CreateButton;
