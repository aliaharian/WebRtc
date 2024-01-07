import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { peerState } from "../context/peerReducer";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    me && ws.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, me, ws]);
  return (
    <div>
      welcome room {id}
      <div className="w-full grid grid-cols-4 gap-4">
        <div className="border border-blue-400">
          <VideoPlayer stream={stream} />
          <p>me!</p>
        </div>
        {Object.keys(peers as peerState).map((peer, index) => {
          return (
            <div key={index} className="border border-blue-400">
              <VideoPlayer stream={peers[peer].stream} />
              <p>peerId: {peer}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Room;
