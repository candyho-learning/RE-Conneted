import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

export default function ToggleAudioButton() {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <Button
      onClick={() => microphone.toggle()}
      variant="outline"
      size="icon"
      className="border-none rounded-full scale-110  shadow-lg"
    >
      {isMute ? (
        <i className="fa-solid fa-microphone-slash text-red-500"></i>
      ) : (
        <i className="fa-solid fa-microphone text-green-500"></i>
      )}
    </Button>
  );
}
