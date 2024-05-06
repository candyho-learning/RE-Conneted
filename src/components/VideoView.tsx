import {
  useCallStateHooks,
  CallingState,
  PaginatedGridLayout,
} from "@stream-io/video-react-sdk";
import { VideoViewProps } from "../interface/interfaces";

import CallControlBar from "./CallControlBar";

export default function VideoView({ isHost, sessionData }: VideoViewProps) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  console.log(`calling state is ${callingState}`);
  if (callingState !== CallingState.JOINED) {
    return <div>You are not in the call.</div>;
  }
  return (
    <div>
      <div style={{ width: "50%", height: "450px" }}>
        <PaginatedGridLayout groupSize={4} pageArrowsVisible={true} />
      </div>
      <CallControlBar isHost={isHost} sessionData={sessionData} />
    </div>
  );
}
