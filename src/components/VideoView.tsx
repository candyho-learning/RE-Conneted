import {
  useCallStateHooks,
  CallingState,
  PaginatedGridLayout,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { VideoViewProps } from "../interface/interfaces";

import CallControlBar from "./CallControlBar";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoView({ isHost, sessionData }: VideoViewProps) {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const client = useStreamVideoClient();
  console.log(`calling state is ${callingState}`);
  if (callingState === CallingState.LEFT) {
    client?.disconnectUser();
    const userCompletedTaskCount =
      sessionData?.participantsActivity
        ?.find((item) => item.userId === userId)
        ?.goals?.filter((task) => task.isDone).length || 0;
    navigate("/thankyou", {
      state: {
        tasksCompleted: userCompletedTaskCount,
        participants: sessionData?.participantsActivity?.length,
        isHost: isHost,
      },
    });
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
