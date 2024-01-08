import { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";

const ChatInput = () => {
  const [message, setMessage] = useState<string>(" ");
  const { sendMessage } = useContext(RoomContext);
  return (
    <div className="flex">
      <form
        className="flex gap-x-1"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <textarea
          value={message}
          className="border border-gray-300"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="border border-gray-300 bg-blue-200 rounded-lg py-2 px-4 hover:bg-blue-500 hover:text-white transition-all"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
