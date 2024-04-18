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

import "stream-chat-react/dist/css/v2/index.css";
import FocusTimer from "../components/FocusTimer";
import { getSessionData } from "../utils/utils";
import { SessionDataType } from "../interface/interfaces";
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
  const { isLoggedIn } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const [call, setCall] = useState<Call>();
  const [sessionData, setSessionData] = useState<SessionDataType>();
  const [isHost, setIsHost] = useState();
  //@ts-ignore
  const [chatChannel, setChatChannel] = useState<Channel>();
  const imageUrl =
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTMyNzk5Mzl8&ixlib=rb-4.0.3&q=85";

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
          name: "Session Chat",
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
    if (client && call) {
      call.join({ create: true });
    }
  }, [call]);
  if (!isLoggedIn) return <Login context="force" />;

  return (
    <div
      style={{
        backgroundImage: call ? `url(${imageUrl})` : "none",
        width: "100%",
        height: "100vh",
        backgroundSize: "cover",
        position: "relative",
      }}
      className="session-wrapper"
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
      {sessionData && <FocusTimer {...sessionData} />}
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
