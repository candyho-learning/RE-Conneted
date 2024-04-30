import { useSearchParams } from "react-router-dom";
import {
  StreamVideoClient,
  User,
  Call,
  StreamCall,
  StreamVideo,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { getStreamUserToken } from "../utils/utils";
import { useContext, useEffect, useState } from "react";
import VideoView from "../components/VideoView";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { onSnapshot, doc } from "firebase/firestore";

import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import "stream-chat-react/dist/css/v2/index.css";
import FocusTimer from "../components/FocusTimer";
import { getSessionData } from "../utils/utils";
import { SessionDataType } from "../interface/interfaces";
import GoalTracker from "../components/GoalTracker";
import Loading from "@/components/Loading";
import ParticipantInfoDrawer from "@/components/ParticipantInfoDrawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
//@ts-ignore
const userCredential = JSON.parse(localStorage.getItem("userCredential"));

const API_KEY: string = import.meta.env.VITE_STREAM_API_KEY;
const userId: string = userCredential?.uid;

const user: User = {
  id: userId,
};

const client = new StreamVideoClient({
  apiKey: API_KEY,
  tokenProvider: () => getStreamUserToken(userId),
  user,
});

const chatClient = new StreamChat(API_KEY);
//@ts-ignore
chatClient.connectUser(user, () => getStreamUserToken(userId));

export default function Session2() {
  const { isLoggedIn, user, isLoading } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const [call, setCall] = useState<Call>();
  const [sessionData, setSessionData] = useState<SessionDataType>();
  const [isHost, setIsHost] = useState<boolean>();
  //@ts-ignore
  const [chatChannel, setChatChannel] = useState<Channel>();

  useEffect(() => {
    if (!callId) return;
    const unsub = onSnapshot(doc(db, "sessions", callId), (doc) => {
      console.log("change in session data!");
      console.log("Current data: ", doc.data());
      console.log(typeof doc.data());
      setSessionData(doc.data() as SessionDataType);
    });
    async function init() {
      if (callId) {
        const newCall = client.call(callType, callId);
        setCall(newCall);
        const chatChannel = chatClient.channel("messaging", callId, {
          // add as many custom fields as you'd like
          image: "https://www.drupal.org/files/project-images/react.png",
          name: sessionData?.sessionName,
        });
        setChatChannel(chatChannel);
        const sesh = await getSessionData(callId);
        console.log(sesh);
        setSessionData(sesh as SessionDataType);
      }
    }
    init();
    return () => unsub();
  }, [callId]);

  useEffect(() => {
    sessionData && setIsHost(sessionData.host === userId);
  }, [sessionData]);

  useEffect(() => {
    // if (client && call) {
    //   call.join({ create: true });
    // }
  }, [call]);
  if (!isLoggedIn) {
    if (isLoading) return <Loading hint="Setting up the call..." />;
    return <Login context="force" />;
  }

  return (
    <div
      style={{
        backgroundImage: call
          ? `url(${sessionData?.backgroundImageUrl})`
          : "none",
        width: "100vw",
        height: "calc(100vh - 80px)",
        backgroundSize: "cover",
      }}
      className="flex justify-between relative p-10"
    >
      {client && call && (
        <StreamVideo client={client}>
          <StreamTheme>
            <StreamCall call={call}>
              <VideoView isHost={isHost} />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      )}
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
        <div className=" p-10">
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
      {/* <CallControls /> */}
    </div>
  );
}
