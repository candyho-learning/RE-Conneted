import { useCall, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { CallControlBarProps } from "@/interface/interfaces";

export const LeaveSessionButton = ({
  isHost,
  sessionData,
}: CallControlBarProps) => {
  const navigate = useNavigate();
  const call = useCall();
  const client = useStreamVideoClient();
  function leaveSession() {
    isHost ? call?.endCall() : call?.leave();
    client?.disconnectUser();
    navigate("/thankyou", {
      state: { tasksCompleted: 3, participants: 4, isHost: isHost }, // Pass state correctly
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="lg" className="shadow-lg">
          Leave Session
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-extrabold text-xl">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This session isn't completed yet. Are you sure you want to leave
            right now?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white"
            onClick={leaveSession}
          >
            Yes, leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
