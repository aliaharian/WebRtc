export const ADD_PEER = "ADD_PEER" as const;
export const ADD_NAME_PEER = "ADD_NAME_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;
export const ADD_ALL_PEERS = "ADD_ALL_PEERS" as const;
export const CHANGE_PEER_NAME = "CHANGE_PEER_NAME" as const;
export const addPeerAction = (peerId: string, stream: MediaStream) => ({
  type: ADD_PEER,
  payload: { peerId, stream },
});
export const removePeerAction = (peerId: string) => ({
  type: REMOVE_PEER,
  payload: { peerId },
});

export const addPeerNameAction = (peerId: string, username: string) => ({
  type: ADD_NAME_PEER,
  payload: { peerId, username },
});

export const addAllPeersAction = (peers: Record<string, any>) => ({
  type: ADD_ALL_PEERS,
  payload: { peers },
});

export const changePeerNameAction = (peerId:string,username:string)=>({
  type: CHANGE_PEER_NAME,
  payload: { peerId,username },
})