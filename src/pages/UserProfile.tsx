import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  const { userId, isLoggedIn } = useContext(AuthContext);
  const { userId: userIdParam } = useParams<{ userId: string | undefined }>();
  const [userData, setUserData] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOwner, setIsProfileOwnder] = useState(false);
  // const isProfileOwner = userId === userIdParam;
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
        setIsProfileOwnder(userId === userIdParam);
      } catch (err) {
        console.error(err);
        console.log("this user does not exist.");
      } finally {
        setIsLoading(false);
      }
    }

    if (userIdParam) {
      init(userIdParam);
    }
  }, [userIdParam]);

  if (!userData || !userIdParam) {
    if (isLoading) {
      return <Loading hint="Loading Profile..." />;
    }
    return <h1>This user does not exist!</h1>;
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="user-profile-wrapper py-20 px-20 flex flex-col justify-center">
      <div className="main-info w-4/5 mx-auto bg-white rounded-[60px] relative py-6">
        <div className="flex px-28 items-center">
          <div className="avatar-location flex- flex-col items-center">
            <Avatar className="w-48 h-48 static border-4 border-gray-600 mt-[-40%]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>
                {userData.firstName[0]}
                {userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {userData.location && (
              <h1 className="text-xl my-5 text-center">
                📍 {userData.location}
              </h1>
            )}
          </div>

          <div className="wrapper ml-10 mb-20">
            <div className="flex items-center">
              <h1 className="text-5xl font-extrabold mr-5">
                {userData.firstName} {userData.lastName}
              </h1>
              {isProfileOwner && (
                <Link to="/settings">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>

            <div className="text-brand-dark italic text-sm">
              Member since{" "}
              {userData.accountCreatedTimestamp.toDate().toDateString()}
            </div>

            <div className="flex mt-5">
              {userData.tags &&
                userData.tags.map((tag) => (
                  <Badge
                    className="mr-2 h-[20px] text-[13px]"
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {isProfileOwner && (
          <div className="mx-auto px-10">
            <EditableQuote
              databaseContent={userData.quote}
              fieldName="quote"
              userIdParam={userId}
            />
          </div>
        )}
        {!isProfileOwner && (
          <div className="w-4/5 h-16 mx-auto my-10 relative rounded-lg border-l-8 border-l-gray-500 bg-gray-200 py-5 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“']">
            {userData.quote || "Hi, I'm new here. RE:Connect with me!"}
          </div>
        )}
      </div>

      <div className="w-4/5 mx-auto my-10">
        <h2 className="scroll-m-20 border-b-[7px] text-3xl font-semibold tracking-tight first:mt-0 mb-10 border-b-brand-yellow w-fit">
          Hosting Sessions
        </h2>
        {userData.sessions && (
          <SessionCardCarousel
            sessions={userData.sessions}
            isProfileOwner={isProfileOwner}
          />
        )}
        {!userData.sessions && (
          <p>This user isn't hosting any sessions for now.</p>
        )}
      </div>
      <div className="w-4/5 mx-auto">
        <h2 className="scroll-m-20 border-b-[7px] text-3xl font-semibold tracking-tight first:mt-0 mb-10 border-b-brand-lightblue w-fit">
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
