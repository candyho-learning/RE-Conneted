import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useSearchParams } from "react-router-dom";
import { SessionDataType } from "@/interface/interfaces";
import {
  StreamVideo,
  Call,
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { getSessionData } from "@/utils/utils";
import { StreamContext } from "@/contexts/streamContext";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  Chat,
} from "stream-chat-react";
import VideoView from "@/components/VideoView";
import FocusTimer from "@/components/FocusTimer";
import GoalTracker from "@/components/GoalTracker";
import ParticipantInfoDrawer from "@/components/ParticipantInfoDrawer";
import "stream-chat-react/dist/css/v2/index.css";

export default function Session4() {
  const { userId, user } = useContext(AuthContext);
  const { videoClient, chatClient } = useContext(StreamContext);
  const [searchParams] = useSearchParams();
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const [sessionData, setSessionData] = useState<SessionDataType>();
  const [videoCall, setVideoCall] = useState<Call>();
  const [chatChannel, setChatChannel] = useState<any>();
  const isHost = sessionData?.host === userId;

  useEffect(() => {
    if (!callId) return;
    videoClient &&
      chatClient &&
      (async () => {
        // console.log("getting sesession with getdoc");
        const data = await getSessionData(callId);
        if (!data) return;
        setSessionData(data as SessionDataType);
        // console.log("setting up stream call and channel");
        const call = videoClient?.call(callType, callId);
        setVideoCall(call);
        const channel = chatClient?.channel("messaging", callId, {
          name: data.sessionName,
        });
        setChatChannel(channel);
      })();
  }, [callId, videoClient, chatClient]);

  useEffect(() => {
    if (!callId) return;
    const unsub = onSnapshot(doc(db, "sessions", callId), (doc) => {
      // console.log("change in session data!");
      setSessionData(doc.data() as SessionDataType);
    });

    return () => unsub();
  }, [callId]);

  useEffect(() => {
    if (videoCall) {
      videoCall.join({ create: true });
    }

    return () => {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        videoCall?.leave();
      })();
    };
  }, [videoCall]);

  //if sessionId is valid and data is retrived, create/join a call and channel
  if (!sessionData) return <h1>This session doesn't exist</h1>;
  // if (isLoading) {
  //   return <Loading hint="Setting up the call..." />;
  // }
  if (chatClient && videoClient && chatChannel && videoCall)
    return (
      <div
        style={{
          backgroundImage: videoCall
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${sessionData?.backgroundImageUrl})`
            : "none",
          width: "100vw",
          height: "calc(100vh - 80px)",
          backgroundSize: "cover",
        }}
        className="flex justify-between relative p-14"
      >
        <StreamVideo client={videoClient}>
          <StreamTheme>
            <StreamCall call={videoCall}>
              <VideoView isHost={isHost} sessionData={sessionData} />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>

        <div className="wrapper flex justify-between flex-1">
          <div className="flex flex-col items-center flex-1">
            {sessionData && <FocusTimer {...sessionData} />}

            {sessionData && user && (
              <div>
                <GoalTracker
                  sessionId={sessionData.sessionId}
                  userId={userId}
                  userName={user?.firstName}
                  userLocation={user?.location}
                />
              </div>
            )}
          </div>
          <div className="p-10 pt-0">
            {sessionData && user && (
              <ParticipantInfoDrawer sessionData={sessionData} />
            )}
          </div>
        </div>

        <div className="chat-window">
          <Chat client={chatClient} theme="str-chat__theme-light">
            <Channel channel={chatChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    );
}
