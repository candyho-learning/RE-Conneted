import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "./ui/button";

export default function SessionList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Session Name</TableHead>
          <TableHead className="text-right">Join Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">2024/05/01</TableCell>
          <TableCell>15:32PM</TableCell>
          <TableCell>The Breakfast Club</TableCell>
          <TableCell className="text-right">
            <Button className={buttonVariants({ size: "sm" })}>Join</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
