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
            <TableCell>{session.sessionName}</TableCell>
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
