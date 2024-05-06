import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

export default function ToggleVideoButton() {
  const { useCameraState } = useCallStateHooks();
  const { camera, isMute } = useCameraState();
  return (
    <Button
      onClick={() => camera.toggle()}
      variant="outline"
      size="icon"
      className="border-none rounded-full scale-110  shadow-lg"
    >
      {isMute ? (
        <i className="fa-solid fa-video-slash text-red-500"></i>
      ) : (
        <i className="fa-solid fa-video text-green-500"></i>
      )}
    </Button>
  );
}
