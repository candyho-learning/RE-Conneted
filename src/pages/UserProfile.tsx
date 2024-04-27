import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "../utils/utils";
import { UserType } from "../interface/interfaces";
import EditableText from "../components/EditableText";
import { AuthContext } from "../context/authContext";
import ProfileSocialLinks from "../components/ProfileSocialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const { userId } = useContext(AuthContext);
  const { userId: userIdParam } = useParams<{ userId: string | undefined }>();
  const [userData, setUserData] = useState<UserType>();
  const isProfileOwner = userId === userIdParam;
  const hasSocialLink = Boolean(
    userData?.facebookLink ||
      userData?.instagramLink ||
      userData?.twitterLink ||
      userData?.websiteLink ||
      userData?.linkedinLink
  );

  console.log(userIdParam);

  useEffect(() => {
    async function init(userIdParam: string) {
      try {
        const data = await getUserData(userIdParam);
        setUserData(data as UserType);
      } catch (err) {
        console.error(err);
        console.log("this user does not exist.");
      }
    }

    if (userIdParam) {
      init(userIdParam);
    }
  }, [userIdParam]);

  if (!userData || !userIdParam) {
    return <h1>This user does not exist!</h1>;
  }
  return (
    <div className="user-profile-wrapper pb-20 bg-gray-100">
      <div className="main-info flex px-32 py-10 items-center">
        <Avatar className="w-40 h-40 static border-4 border-gray-600">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="wrapper ml-10">
          <div className="flex items-center">
            <h1 className="text-3xl font-extrabold my-3 mr-2">
              {userData.firstName} {userData.lastName}
            </h1>
            {userData.location && (
              <h1 className="text-lg">📍{userData.location}</h1>
            )}
          </div>
          <div className="text-gray-400 italic text-sm">
            Member since{" "}
            {userData.accountCreatedTimestamp.toDate().toDateString()}
          </div>

          <div className="flex mt-5">
            {userData.tags &&
              userData.tags.map((tag) => (
                <Badge className="mr-2 h-[17px] text-[12px]">{tag}</Badge>
              ))}
          </div>
        </div>
      </div>
      <div className=" w-[800px] mx-auto mb-10 relative rounded-lg border-l-8 border-l-gray-500 bg-gray-200 py-5 pl-16 pr-5 font-sans text-sm italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“']">
        {userData.quote}
      </div>
      {/*Tabs*/}
      <Tabs defaultValue="sessions" className="w-[800px] mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-gray-200">
          <TabsTrigger value="sessions">Hosting Sessions</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="contact">Contact Me</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Join {userData.firstName} in these sessions</CardTitle>
              <CardDescription>
                Work & have fun with {userData.firstName}!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-3">
              {userData.futureSessions
                ?.filter((session) => session.role === "host")
                .map((session) => (
                  <Card className="w-60 h-80">
                    <CardHeader>
                      <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQyMDIyNzV8&ixlib=rb-4.0.3&q=85"></img>
                      <CardTitle>{session.sessionName}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p>{session.startTime.toDate().toLocaleString()}</p>
                    </CardContent>

                    <CardFooter>
                      <a
                        href={`/coworking-session?type=default&id=${session.sessionId}`}
                      >
                        <Button>Join</Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2"></CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Connect with {userData.firstName} outside of RE:Connected!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ProfileSocialLinks
                userData={userData}
                hasSocialLinks={hasSocialLink}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
