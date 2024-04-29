import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "../utils/utils";
import { UserType } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import ProfileSocialLinks from "../components/ProfileSocialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditableQuote from "@/components/EditableQuote";

import SessionCardCarousel from "@/components/SessionCardCarousel";
import Loading from "@/components/Loading";
import Login from "./Login";

export default function UserProfile() {
  const { userId, isLoading, isLoggedIn } = useContext(AuthContext);
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
    <div className="user-profile-wrapper pb-20 px-32 flex flex-col justify-center">
      <div className="main-info flex py-10 items-center w-4/5 mx-auto">
        <Avatar className="w-48 h-48 static border-4 border-gray-600">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="wrapper ml-10">
          <div className="flex items-center">
            <h1 className="text-5xl font-extrabold my-3 mr-5">
              {userData.firstName} {userData.lastName}
            </h1>
            {isProfileOwner && (
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            )}
          </div>
          {userData.location && (
            <h1 className="text-xl my-2">📍{userData.location}</h1>
          )}
          <div className="text-gray-400 italic text-sm">
            Member since{" "}
            {userData.accountCreatedTimestamp.toDate().toDateString()}
          </div>

          <div className="flex mt-5">
            {userData.tags &&
              userData.tags.map((tag) => (
                <Badge className="mr-2 h-[20px] text-[13px]">{tag}</Badge>
              ))}
          </div>
        </div>
      </div>

      {isProfileOwner && (
        <div className="w-4/5 mx-auto">
          <EditableQuote
            databaseContent={userData.quote}
            fieldName="quote"
            userIdParam={userId}
          />
        </div>
      )}
      {!isProfileOwner && (
        <div className="w-4/5 mx-auto mb-10 relative rounded-lg border-l-8 border-l-gray-500 bg-gray-200 py-5 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“']">
          {userData.quote}
        </div>
      )}

      <div className="w-4/5 mx-auto my-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
          Hosting Sessions
        </h2>
        {userData.futureSessions && (
          <SessionCardCarousel sessions={userData.futureSessions} />
        )}
        {!userData.futureSessions && (
          <p>This user isn't hosting any sessions.</p>
        )}
      </div>
      <div className="w-4/5 mx-auto">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
          Contact Info
        </h2>
        <ProfileSocialLinks
          userData={userData}
          hasSocialLinks={hasSocialLink}
        />
      </div>
    </div>
  );
}
