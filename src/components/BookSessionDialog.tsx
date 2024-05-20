import { Button } from "@/components/ui/button";
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
import {
  BookSessionDialogProps,
  SessionDataType,
  UserType,
} from "@/interface/interfaces";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/authContext";
import { addUserSession, getSessionData, getUserData } from "@/utils/utils";
import { hyphenatedToReadable, getDaysFromNow } from "@/utils/utils";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { dateOptions, timeOptions } from "@/utils/utils";
import { Badge } from "./ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function BookSessionDialog({
  sessionId,
  buttonText = "Book",
}: BookSessionDialogProps) {
  const { userId, user } = useContext(AuthContext);
  const { toast } = useToast();

  const [sessionDetails, setSessionDetails] = useState<SessionDataType>();
  const [hostDetails, setHostDetails] = useState<UserType>();

  async function handleGetSessionDetails(sessionId: string) {
    const data = await getSessionData(sessionId);
    if (!data) {
      toast({
        variant: "destructive",
        title: "Session Doesn't Exist",
        description: "Please try again with a different session ID.",
      });
      return;
    }
    if (data.host === userId) {
      toast({
        variant: "destructive",
        title: "You don't need to book to join your session.",
        description:
          "You are the host. This sesssion is already in your dashboard.",
      });
      return;
    }
    const hostData = await getUserData(data.host);
    setSessionDetails(data as SessionDataType);
    setHostDetails(hostData as UserType);
  }

  async function confirmSessionBooking(userId: string, sessionId: string) {
    if (user?.sessions?.some((session) => session.sessionId === sessionId)) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description:
          "You already booked this session before. Please check your dashboard for more details.",
      });
      return;
    }

    const userSessionData = {
      sessionId,
      role: "participant",
    };
    const result = await addUserSession(userId, userSessionData);
    console.log("triggering toast");
    if (result)
      toast({
        title: "Session Successfully Booked!",
        description:
          "Added to your personal dashboard. Remember to join on time!",
      });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {
            handleGetSessionDetails(sessionId);
          }}
          disabled={sessionId ? false : true}
        >
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold">
            Book this session?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {sessionDetails && (
              <div>
                <div className="flex items-center mb-3">
                  <h3 className="text-xl font-semibold mr-3">
                    {sessionDetails.sessionName}
                  </h3>
                  {hostDetails && <p>hosted by {hostDetails.firstName}</p>}
                </div>

                {sessionDetails.timeBlocks.map((block, i) => {
                  if (i === sessionDetails.timeBlocks.length - 1) {
                    return (
                      <span>
                        {hyphenatedToReadable(block.type)} {block.duration}m{" "}
                      </span>
                    );
                  } else {
                    return (
                      <span>
                        {hyphenatedToReadable(block.type)} {block.duration}m /{" "}
                        <>&nbsp;</>
                      </span>
                    );
                  }
                })}
                <div className="flex items-center mt-2">
                  <CalendarIcon />
                  <p className="ml-3">
                    {sessionDetails.startTime
                      .toDate()
                      .toLocaleString("en-US", dateOptions)}
                  </p>
                  {getDaysFromNow(sessionDetails.startTime) === "expired" ? (
                    <Badge className="ml-3" variant="destructive">
                      {getDaysFromNow(sessionDetails.startTime)}
                    </Badge>
                  ) : (
                    <Badge className="ml-3" variant="secondary">
                      {getDaysFromNow(sessionDetails.startTime)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center">
                  <ClockIcon />
                  <p className="ml-3">
                    {sessionDetails.startTime
                      .toDate()
                      .toLocaleString("en-US", timeOptions)}
                  </p>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setHostDetails(undefined);
              setSessionDetails(undefined);
            }}
          >
            Cancel
          </AlertDialogCancel>
          {sessionDetails && (
            <AlertDialogAction
              onClick={() => {
                confirmSessionBooking(userId, sessionId);
                setSessionDetails(undefined);
                setHostDetails(undefined);
              }}
              className="font-bold"
              disabled={
                getDaysFromNow(sessionDetails.startTime) === "expired"
                  ? true
                  : false
              }
            >
              Confirm
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
