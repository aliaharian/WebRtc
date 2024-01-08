import {
  ADD_NAME_PEER,
  ADD_PEER,
  REMOVE_PEER,
  ADD_ALL_PEERS,
  CHANGE_PEER_NAME,
} from "./peerActions";

export type peerState = Record<
  string,
  { username?: string; stream?: MediaStream }
>;

type peerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof CHANGE_PEER_NAME;
      payload: { peerId: string; username: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: { peers: Record<string, any> };
    }
  | {
      type: typeof ADD_NAME_PEER;
      payload: { peerId: string; username: string };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };

export const peersReducer = (state: peerState, action: peerAction) => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    case ADD_ALL_PEERS:
      return {
        ...state,
        ...action.payload.peers,
      };
    case CHANGE_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          username: action.payload.username,
        },
      };
    case ADD_NAME_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          username: action.payload.username,
        },
      };
    case REMOVE_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: undefined,
        },
      };
    default:
      return { ...state };
  }
};
