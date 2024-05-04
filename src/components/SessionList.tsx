import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "./ui/button";
import { SessionListProps } from "@/interface/interfaces";
import { Link } from "react-router-dom";
import { dateOptions, timeOptions } from "@/utils/utils";
import { hyphenatedToReadable } from "@/utils/utils";

export default function SessionList({ userSessions }: SessionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5">Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Session Name</TableHead>
          <TableHead className="text-right">Join Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userSessions.map((session) => (
          <TableRow>
            <TableCell className="font-medium">
              {session.startTime.toDate().toLocaleString("en-US", dateOptions)}
            </TableCell>
            <TableCell>
              {session.startTime.toDate().toLocaleString("en-US", timeOptions)}
            </TableCell>
            <TableCell className="flex">
              <p>{session.sessionName}</p>
              <p>
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
            <TableCell className="text-right">
              <Link
                to={`/coworking-session?type=default&id=${session.sessionId}`}
              >
                <Button className={buttonVariants({ variant: "secondary" })}>
                  Join
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
