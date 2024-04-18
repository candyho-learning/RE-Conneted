import {
  useCall,
  useCallStateHooks,
  CallingState,
  PaginatedGridLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import { VideoViewProps } from "../interface/interfaces";

export default function VideoView({ isHost }: VideoViewProps) {
  console.log("I am host", isHost);
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  console.log(`calling state is ${callingState}`);
  if (callingState !== CallingState.JOINED) {
    return <div>You are not in the call.</div>;
  }
  return (
    <div style={{ width: "800px" }}>
      Call "{call?.id}" has {participantCount} participants...
      <div style={{ width: "50%", height: "450px" }}>
        <PaginatedGridLayout />
      </div>
      <CallControls />
      {isHost && (
        <button
          onClick={() => {
            call?.endCall();
          }}
        >
          End Call
        </button>
      )}
    </div>
  );
}
