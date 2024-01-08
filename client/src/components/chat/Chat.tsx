import { useContext, useState } from "react";
import { IMessage } from "../../types/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { RoomContext } from "../../context/RoomContext";

const Chat: React.FC = () => {
  const { chat } = useContext(RoomContext);

    console.log("chat",chat.messages)
  return (
    <div className="flex flex-col h-[calc(100%-80px)] justify-between">
      <div className="max-h-[calc(100%-50px)] overflow-auto flex flex-col-reverse">
        {chat?.messages?.slice().reverse().map((message: IMessage, index: number) => {
          return <ChatBubble key={index} message={message} />;
        })}
      </div>
      <ChatInput />
    </div>

  );
};

export default Chat;
