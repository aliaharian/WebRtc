import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { peerState } from "../reducers/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";
import ChatButton from "../components/ChatButton";
import Chat from "../components/chat/Chat";

const Room = () => {
  const { id } = useParams();
  const {
    ws,
    me,
    stream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    chat,
    toggleChat,
  } = useContext(RoomContext);

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
    <div className="flex flex-col min-h-screen">
      <div className="bg-red-400 p-4 text-white">welcome room {id}</div>
      <div className="flex grow">
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
            <div className="h-max border border-blue-400">
              <VideoPlayer stream={stream} />
              <p>me!</p>
            </div>
          )}
          {Object.keys(peersToShow as peerState).map((peer, index) => {
            return (
              <div key={index} className="h-max border border-blue-400">
                <VideoPlayer stream={peers[peer].stream} />
                <p>peerId: {peer}</p>
              </div>
            );
          })}
        </div>
        {chat.isChatOpen && (
          <div className="border-l border-gray-300 max-h-[calc(100vh-56px)]">
            <Chat />
          </div>
        )}
      </div>
      <div className="h-20 fixed w-full gap-x-2 bottom-0 bg-gray-200 px-2 py-1 flex items-center justify-center border-t border-gray-400">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
export default Room;
