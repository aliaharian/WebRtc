import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { peerState } from "../context/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream, peers, shareScreen, screenSharingId, setRoomId } =
    useContext(RoomContext);

  useEffect(() => {
    if (me) {
      console.log(`i am ${me.id}`);
      ws.emit("join-room", { roomId: id, peerId: me.id });
      setRoomId(id);
    }
  }, [id, me, ws]);
  const screenSharingVideo =
    screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;
  const { [screenSharingId]: sharedVideo, ...peersToShow } = peers;
  return (
    <div>
      welcome room {id}
      <div className="flex">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
            <p>screen sharing</p>
          </div>
        )}
        <div
          className={`${
            screenSharingVideo ? "w-1/5 grid-cols-1" : "w-full grid-cols-4"
          } grid  gap-4`}
        >
          {screenSharingId !== me?.id && (
            <div className="border border-blue-400">
              <VideoPlayer stream={stream} />
              <p>me!</p>
            </div>
          )}
          {Object.keys(peersToShow as peerState).map((peer, index) => {
            return (
              <div key={index} className="border border-blue-400">
                <VideoPlayer stream={peers[peer].stream} />
                <p>peerId: {peer}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fixed w-full bottom-0 bg-gray-200 px-2 py-1 flex items-center justify-center border-t border-gray-400">
        <ShareScreenButton onClick={shareScreen} />
      </div>
    </div>
  );
};
export default Room;
