import { IMessage } from "../types/chat";
import { ADD_MESSAGE, ADD_HISTORY, TOGGLE_CHAT } from "./chatActions";

export type chatState = {
  messages: IMessage[];
  isChatOpen: boolean;
};

type chatAction =
  | {
      type: typeof ADD_MESSAGE;
      payload: { message: IMessage };
    }
  | {
      type: typeof ADD_HISTORY;
      payload: { messages: IMessage[] };
    }
  | {
      type: typeof TOGGLE_CHAT;
    };

export const chatReducer = (state: chatState, action: chatAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    case ADD_HISTORY:
      return {
        ...state,
        messages: [...action.payload.messages],
      };
    case TOGGLE_CHAT:
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };
    default:
      return { ...state };
  }
};
