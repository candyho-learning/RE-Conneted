import { useContext, useEffect, useState } from "react";
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
import BookSessionDialog from "@/components/BookSessionDialog";
import { getMultipleSessionDetails } from "@/utils/utils";
import { SessionDataType } from "@/interface/interfaces";

export default function Dashboard() {
  const { user, isLoggedIn, userId } = useContext(AuthContext);
  const [sessionCode, setSessionCode] = useState("");
  const [hostingSessions, setHostingSessions] =
    useState<Array<SessionDataType>>();
  const [joiningSessions, setJoiningSessions] =
    useState<Array<SessionDataType>>();
  useEffect(() => {
    if (user?.futureSessions && user.futureSessions.length > 0) {
      (async () => {
        if (!user.futureSessions) return;
        // Get session details
        const data = await getMultipleSessionDetails(
          user.futureSessions.map((session) => session.sessionId)
        );
        console.log(data);
        const hostingSessionData = data?.filter(
          (session) => session.host === userId
        );
        const joiningSessionData = data?.filter(
          (session) => session.host !== userId
        );
        setHostingSessions(hostingSessionData);
        setJoiningSessions(joiningSessionData);
      })();
    }
  }, [user?.futureSessions]);
  if (!isLoggedIn) return <Login />;
  return (
    <div className="bg-gray h-full flex px-10">
      <div className="w-1/3  p-10 bg-gray-400 rounded-lg text-white h-screen mt-8">
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
              <Link to="#">
                <h3>Sessions</h3>
              </Link>
            </li>
            <li>
              <Link to={`/connect/${userId}`}>
                <h3>View My Profile</h3>
              </Link>
            </li>
            <li>
              <Link to="#">
                <h3>Share RE:Connected With a Friend</h3>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border mt-10 text-lg font-medium p-5 rounded-sm bg-background">
          <h4 className="text-brand-dark font-semibold">
            Join a Session with Code
          </h4>
          <div className="flex w-4/5 space-x-2 mt-3">
            <Input
              className="bg-white text-brand-dark"
              placeholder="Session Code"
              name="session-code"
              value={sessionCode}
              onChange={(e) => {
                setSessionCode(e.target.value);
              }}
              onFocus={() => {
                setSessionCode("");
              }}
            />
            <BookSessionDialog buttonText="Add" sessionId={sessionCode} />
          </div>
        </div>
      </div>

      <div className="w-2/3 p-10">
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
                {hostingSessions && hostingSessions.length > 0 && (
                  <SessionList userSessions={hostingSessions} />
                )}
                {(!hostingSessions || hostingSessions.length === 0) && (
                  <p className="text-gray-400 font-thin text-sm">
                    You don't have upcoming hosting sessions.{" "}
                    <a href="/create-session" className="underline">
                      Create a session now!
                    </a>
                  </p>
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
                {joiningSessions && (
                  <SessionList userSessions={joiningSessions} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
