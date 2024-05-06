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
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export const LeaveSessionButton = ({
  isHost,
  sessionData,
}: CallControlBarProps) => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const call = useCall();
  const client = useStreamVideoClient();
  function leaveSession() {
    if (isHost) {
      call?.endCall();
    } else {
      call?.leave();
    }
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
