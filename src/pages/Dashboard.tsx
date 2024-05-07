import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import UserAvatar from "@/components/UserAvatar";

export default function Dashboard() {
  const { user, isLoggedIn, userId } = useContext(AuthContext);
  const [sessionCode, setSessionCode] = useState("");
  const [hostingSessions, setHostingSessions] =
    useState<Array<SessionDataType>>();
  const [joiningSessions, setJoiningSessions] =
    useState<Array<SessionDataType>>();
  const [expiredSessions, setExpiredSessions] =
    useState<Array<SessionDataType>>();
  useEffect(() => {
    if (user?.sessions && user.sessions.length > 0) {
      (async () => {
        if (!user.sessions) return;
        // Get session details
        const data = await getMultipleSessionDetails(
          user.sessions.map((session) => session.sessionId)
        );
        console.log(data);
        const nonExpiredSessions = data?.filter(
          (session) => new Date() < session.linkValidPeriod?.end.toDate()
        );
        const hostingSessionData = nonExpiredSessions?.filter((session) => {
          return session.host === userId;
        });
        const joiningSessionData = nonExpiredSessions?.filter(
          (session) => session.host !== userId
        );

        const expiredSessionData = data?.filter(
          (session) => session.linkValidPeriod.end.toDate() < new Date()
        );
        setHostingSessions(hostingSessionData);
        setJoiningSessions(joiningSessionData);
        setExpiredSessions(expiredSessionData);
      })();
    }
  }, [user?.sessions]);
  if (!isLoggedIn) return <Login />;
  return (
    <div className="bg-gray h-full flex px-10">
      <div className="w-1/4  px-10 bg-gray-400 rounded-lg text-white h-screen mt-8">
        <div className="w-40 h-40 mx-auto mb-5">
          <UserAvatar />
        </div>
        <h2 className="text-3xl font-semibold text-center mb-3">
          {user?.firstName} {user?.lastName}
        </h2>
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
        <div className="border mt-10 text-md font-medium p-5 rounded-sm bg-background">
          <h4 className="text-brand-dark font-semibold">
            Join a Session with Code
          </h4>
          <div className="flex space-x-2 mt-3">
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

      <div className="w-3/4 p-10">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-10">
          Your RE:Connected Sessions
        </h3>

        <Tabs defaultValue="hosting" className="w-full">
          <TabsList className="grid w-1/4 grid-cols-3 mb-5">
            <TabsTrigger value="hosting">Hosting</TabsTrigger>
            <TabsTrigger value="joining">Joining</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          <TabsContent value="hosting">
            <Card className="mb-5">
              <CardHeader>
                <CardTitle>Upcoming Sessions You Host</CardTitle>
                <CardDescription>
                  You will be able to join 30 minutes before the scheduled start
                  time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hostingSessions && hostingSessions.length > 0 && (
                  <SessionList
                    userSessions={hostingSessions}
                    isHosting={true}
                  />
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
                <CardDescription>
                  Are you excited to meet new friends and get some work done?
                </CardDescription>
              </CardHeader>
              <CardContent>
                {joiningSessions && (
                  <SessionList userSessions={joiningSessions} />
                )}
                {(!joiningSessions || joiningSessions.length === 0) && (
                  <p className="text-gray-400 font-thin text-sm mt-3">
                    You don't have upcoming join sessions.{" "}
                    <a href="/community" className="underline">
                      Find sessions to join from the community!
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expired">
            <Card className="mb-5">
              <CardHeader>
                <CardTitle>Expired Sessions</CardTitle>
                <CardDescription>
                  Session links are for one-time use only and will expire after
                  the session ends or after the scheduled end time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expiredSessions && (
                  <SessionList
                    userSessions={expiredSessions}
                    isExpiredSessions={true}
                  />
                )}
                {(!expiredSessions || expiredSessions.length === 0) && (
                  <p className="text-gray-400 font-thin text-sm mt-3">
                    You don't have any session history yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
