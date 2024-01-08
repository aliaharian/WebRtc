import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

const NameInput = () => {
  const { username, setUsername } = useContext(RoomContext);
  return (
    <input
      placeholder="enter your username"
      value={username}
      onChange={(e)=>{setUsername(e.target.value)}}
      className="border border-gray-300 rounded-md p-2 h-10 my-2"
    />
  );
};

export default NameInput;
