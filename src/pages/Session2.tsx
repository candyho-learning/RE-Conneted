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
import { useEffect, useState } from "react";
import VideoView from "../components/VideoView";

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
  const [searchParams] = useSearchParams();
  const callId = searchParams.get("id");
  const callType = searchParams.get("type") || "default";
  const [call, setCall] = useState<Call>();

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

  return (
    <div>
      Session2 page placeholder for session {callId}
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
