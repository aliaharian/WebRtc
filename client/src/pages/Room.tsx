import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { peerState } from "../context/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream, peers, shareScreen } = useContext(RoomContext);

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
      <div className="fixed w-full bottom-0 bg-gray-200 px-2 py-1 flex items-center justify-center border-t border-gray-400">
        <ShareScreenButton onClick={shareScreen} />
      </div>
    </div>
  );
};
export default Room;
