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
import { AuthContext } from "../context/authContext";
import VideoView from "../components/VideoView";

const userCredential = JSON.parse(localStorage.getItem("userCredential") || "");
console.log(userCredential?.uid);

export default function Session() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | undefined>();
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const { userId, isLoggedIn, user } = useContext(AuthContext);
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  useEffect(() => {
    userId &&
      (async function fetchToken() {
        const token = await getStreamUserToken(userId);
        token && setToken(token);
      })();
  }, [userId]);

  useEffect(() => {
    if (API_KEY && userId && token && callId) {
      const streamClient = new StreamVideoClient({
        apiKey: API_KEY,
        user: userObject,
        token: token,
      });

      setClient(streamClient);

      const newCall = client?.call(callType, callId);
      setCall(newCall);
      console.log("joining call in useeffect");
      console.log(call);
    }
  }, [token, userId, API_KEY, callId]);

  const userObject: User = {
    id: userId,
    name: user?.firstName,
  };

  if (!isLoggedIn) {
    return <h1>Please log in to continue.</h1>;
  }

  return (
    <div>
      Session page placeholder for session {callId}
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
