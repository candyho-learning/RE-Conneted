import {
  useCall,
  useCallStateHooks,
  CallingState,
  PaginatedGridLayout,
  CallControls,
} from "@stream-io/video-react-sdk";

export default function VideoView() {
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
      Call "{call?.id}" has {participantCount} participants
      <div style={{ width: "40%" }}>
        <PaginatedGridLayout />
      </div>
      <CallControls />
      <button
        onClick={() => {
          call?.endCall();
        }}
      >
        Leave Call
      </button>
    </div>
  );
}
