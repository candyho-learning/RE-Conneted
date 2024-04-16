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

export default function Session2() {
  const { isLoggedIn } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const [call, setCall] = useState<Call>();
  const imageUrl =
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTMyNzk5Mzl8&ixlib=rb-4.0.3&q=85";

  useEffect(() => {
    if (callId) {
      const newCall = client.call(callType, callId);
      setCall(newCall);
    }
  }, []);

  useEffect(() => {
    if (client && call) {
      call.join({ create: true });
    }
  }, [call]);
  if (!isLoggedIn) return <Login context="force" />;

  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        width: "100%",
        height: "100vh",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <h4>Session2 page placeholder for session {callId}.</h4>
      {client && call && (
        <StreamVideo client={client}>
          <StreamTheme>
            <StreamCall call={call}>
              <VideoView />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      )}
    </div>
  );
}
