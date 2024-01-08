import { IMessage } from "../types/chat";

export const ADD_MESSAGE = "ADD_MESSAGE" as const;
export const ADD_HISTORY = "ADD_HISTORY" as const;
export const TOGGLE_CHAT = "TOGGLE_CHAT" as const;

export const addMessageAction = (message: IMessage) => ({
  type: ADD_MESSAGE,
  payload: { message },
});
export const addHistoryAction = (messages: IMessage[]) => ({
  type: ADD_HISTORY,
  payload: { messages },
});

export const toogleChatAction = () => ({
  type: TOGGLE_CHAT,
});
