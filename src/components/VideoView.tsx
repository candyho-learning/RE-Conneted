import {
  useCall,
  useCallStateHooks,
  CallingState,
  PaginatedGridLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import { VideoViewProps } from "../interface/interfaces";
import { Button } from "./ui/button";

export default function VideoView({ isHost }: VideoViewProps) {
  const call = useCall();
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
      <CallControls />
      {isHost && (
        <Button
          onClick={() => {
            call?.endCall();
          }}
          variant="destructive"
          className="absolute bottom-8 left-28"
        >
          End Call For Everyone
        </Button>
      )}
      {!isHost && (
        <Button
          onClick={() => {
            //TODO
            console.log("leaving session");
          }}
          variant="destructive"
          className="absolute bottom-8 left-16"
        >
          Leave Session
        </Button>
      )}
    </div>
  );
}
