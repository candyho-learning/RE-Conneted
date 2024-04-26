import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SessionList from "@/components/SessionList";

export default function Dashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) return <Login context="force" />;
  return (
    <div className="bg-gray h-fit flex bg-red-300">
      <div className="w-1/3  bg-slate-200 px-10 py-10">
        <div className="flex mb-10 items-center">
          <Avatar className="w-20 h-20 static">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="ml-5 text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
        </div>

        <nav>
          <Link to="/create-session">
            <Button className={`w-full ${buttonVariants({ size: "lg" })}`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create a Session
            </Button>
          </Link>
          <ul className="text-lg font-medium  space-y-8 mt-10">
            <li>
              <Link to="#">Sessions</Link>
            </li>
            <li>
              <Link to="#">My Profile</Link>
            </li>
            <li>
              <Link to="#">Share RE:Connected With a Friend</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="w-2/3 p-5">
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Upcoming Sessions You Host</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions You Are Joining</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
