import { useContext, useState } from "react";
import { IMessage } from "../../types/chat";
import { RoomContext } from "../../context/RoomContext";
import classNames from "classnames";
const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
  const { me, peers } = useContext(RoomContext);
  const isSelf = message.author === me?.id;
  const author = message.author && peers[message.author];
  const username = author?.username || "deleted user";
  const time = new Date(message.timestamp).toLocaleString();
  return (
    <div
      className={classNames("m-2 flex flex-col", {
        "pl-10 items-end": isSelf,
        "pr-10 items-start": !isSelf,
      })}
    >
      <div
        className={classNames("inline-block py-2 px-4 rounded", {
          "bg-blue-200 text-right": isSelf,
          "bg-blue-300 text-left": !isSelf,
        })}
      >
        {message.content}
        <div
          className={classNames("text-xs opacity-50", {
            "text-right": isSelf,
            "text-left": !isSelf,
          })}
        >
          {time}
        </div>
      </div>
      <p className="inline-block text-xs">{isSelf ? "" : username}</p>
    </div>
  );
};

export default ChatBubble;
