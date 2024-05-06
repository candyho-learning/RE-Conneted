import ToggleAudioButton from "./ToggleAudioButton";
import ToggleVideoButton from "./ToggleVideoButton";
import { LeaveSessionButton } from "./LeaveSessionButton";
import { CallControlBarProps } from "@/interface/interfaces";
export default function CallControlBar({
  isHost,
  sessionData,
}: CallControlBarProps) {
  return (
    <div className="fixed bottom-5 flex space-x-6 left-1/2 transform -translate-x-1/2">
      <ToggleAudioButton />
      <ToggleVideoButton />
      <LeaveSessionButton isHost={isHost} sessionData={sessionData} />
    </div>
  );
}
