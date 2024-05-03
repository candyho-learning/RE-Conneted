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
import { AuthContext } from "@/context/authContext";
import { getSessionData, getUserData } from "@/utils/utils";
import { hyphenatedToReadable, getDaysFromNow } from "@/utils/utils";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { dateOptions, timeOptions } from "@/utils/utils";
import { Badge } from "./ui/badge";

export default function BookSessionDialog({
  sessionId,
}: BookSessionDialogProps) {
  const { userId } = useContext(AuthContext);
  const [sessionDetails, setSessionDetails] = useState<SessionDataType>();
  const [hostDetails, setHostDetails] = useState<UserType>();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGetSessionDetails(sessionId: string) {
    const data = await getSessionData(sessionId);
    if (!data) {
      setErrorMessage("This session does not exist.");
      return;
    }
    const hostData = await getUserData(data.host);
    setSessionDetails(data as SessionDataType);
    setHostDetails(hostData as UserType);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {
            handleGetSessionDetails(sessionId);
          }}
        >
          Book!!!
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold">
            Book this session?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage && <p>{errorMessage}</p>}
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
                  <Badge className="ml-3" variant="secondary">
                    {getDaysFromNow(sessionDetails.startTime)}
                  </Badge>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              console.log("book");
            }}
            className="font-bold"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
