import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { SessionListProps } from "@/interface/interfaces";
import { Link } from "react-router-dom";
import {
  dateOptions,
  getDaysFromNow,
  sortSessions,
  timeOptions,
} from "@/utils/utils";
import { hyphenatedToReadable } from "@/utils/utils";
import { toast } from "./ui/use-toast";
import { Badge } from "./ui/badge";

export default function SessionList({
  userSessions,
  isHosting = false,
  isExpiredSessions = false,
}: SessionListProps) {
  userSessions = sortSessions(userSessions);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Session Name</TableHead>
          {!isExpiredSessions && (
            <TableHead className="text-right">Join Link</TableHead>
          )}
          {isHosting && <TableHead className="text-right">Code</TableHead>}
          {isExpiredSessions && <TableHead>Status</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {userSessions.map((session) => (
          <TableRow>
            <TableCell className="font-medium whitespace-pre-wrap">
              <p>
                {session.startTime
                  .toDate()
                  .toLocaleString("en-US", dateOptions)}
              </p>
              {!isExpiredSessions && (
                <Badge
                  className={`font-normal mt-1 ${
                    getDaysFromNow(session.startTime) === "today"
                      ? "bg-brand-lightblue font-medium pointer-events-none"
                      : ""
                  }`}
                  variant="secondary"
                >
                  {getDaysFromNow(session.startTime)}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {session.startTime.toDate().toLocaleString("en-US", timeOptions)}
            </TableCell>
            <TableCell className="whitespace-pre">
              <p>
                {session.sessionName}{" "}
                {isHosting &&
                getDaysFromNow(session.createdTimestamp) === "today" ? (
                  <Badge className="ml-2 text-xs font-normal py-0 pointer-events-none">
                    New!
                  </Badge>
                ) : (
                  ""
                )}
              </p>
              <p className="text-xs text-brand-darkgrey mt-1">
                {session.timeBlocks.map((block, i) => {
                  if (i === session.timeBlocks.length - 1) {
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
              </p>
            </TableCell>
            {!isExpiredSessions && (
              <TableCell className="text-right">
                {/* <Link
                  to={
                    session.linkValidPeriod.start.toDate() < new Date()
                      ? `/coworking-session?type=default&id=${session.sessionId}`
                      : ""
                  }
                > */}
                <Link
                  to={`/coworking-session?type=default&id=${session.sessionId}`}
                >
                  <Button
                    variant="secondary"
                    disabled={
                      session.linkValidPeriod.start.toDate() < new Date()
                        ? false
                        : true
                    }
                  >
                    Join
                  </Button>
                </Link>
              </TableCell>
            )}
            {isHosting && (
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  className="mx-auto"
                  onClick={() => {
                    navigator.clipboard.writeText(session.sessionId);
                    toast({
                      title: "Session Code Copied!",
                      description:
                        "Share this code with your friends to invite them to your session.",
                    });
                  }}
                >
                  <i className="fa-regular fa-copy"></i>
                </Button>
              </TableCell>
            )}
            {isExpiredSessions && (
              <Badge className="font-normal mt-5" variant="destructive">
                expired
              </Badge>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
