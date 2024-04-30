import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) return <Login context="force" />;
  return (
    <div className="bg-gray h-full flex py-20 px-40">
      <div className="w-1/3  px-10">
        <div className="flex mb-10 items-center ">
          <Avatar className="w-40 h-40 static">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="ml-5 text-5xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
        </div>

        <nav>
          <Link to="/create-session">
            <Button className="w-full h-14 text-lg font-bold">
              <PlusIcon className="mr-2 h-6 w-6 font-bold" />
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
        <div className="border mt-10 text-lg font-medium p-5 rounded-sm bg-gray-100">
          Join a Session with Code
          <div className="flex w-4/5 space-x-2 mt-3">
            <Input className="bg-white" placeholder="Session Code" />
            <Button>Add</Button>
          </div>
        </div>
      </div>

      <div className="w-2/3 p-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-10">
          Your Upcoming Sessions
        </h3>
        <Tabs defaultValue="hosting" className="w-full">
          <TabsList className="grid w-1/4 grid-cols-2 mb-5">
            <TabsTrigger value="hosting">Hosting</TabsTrigger>
            <TabsTrigger value="joining">Joining</TabsTrigger>
          </TabsList>
          <TabsContent value="hosting">
            <Card className="mb-5">
              <CardHeader>
                <CardTitle>Upcoming Sessions You Host</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                {user && user.futureSessions && (
                  <SessionList
                    userSessions={user?.futureSessions.filter(
                      (session) => session.role === "host"
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="joining">
            <Card className="mb-5">
              <CardHeader>
                <CardTitle>Upcoming Sessions You're Joining</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                {user && user.futureSessions && (
                  <SessionList
                    userSessions={user?.futureSessions.filter(
                      (session) => session.role !== "host"
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
