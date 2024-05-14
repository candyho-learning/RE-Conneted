import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserType } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import ProfileSocialLinks from "../components/ProfileSocialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditableQuote from "@/components/EditableQuote";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

import SessionCardCarousel from "@/components/SessionCardCarousel";
import Loading from "@/components/Loading";
import Login from "./Login";

export default function UserProfile() {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const { userId: userIdParam } = useParams<{ userId: string | undefined }>();
  const [userData, setUserData] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(true);
  // const [isProfileOwner, setIsProfileOwnder] = useState(false);
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
    if (!userIdParam) return;

    const userDocRef = doc(db, "users", userIdParam);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data() as UserType);
        setIsLoading(false);
      } else {
        console.log("User not found");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
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
    <div className="user-profile-wrapper py-10 px-20 flex flex-col justify-center">
      <div className="main-info w-4/5 mx-auto bg-white rounded-[60px] relative py-8 px-10">
        <div className="flex px-14 items-center mb-12">
          <Avatar className="w-48 h-48 static bg-brand-mutedblue border-4 border-white flex justify-center items-center">
            <AvatarImage
              src={`/avatars/avatar${userData?.avatar}.png`}
              alt="user avatar"
              className="w-4/5 h-4/5 object-contain"
            />
            <AvatarFallback>
              {userData.firstName[0]}
              {userData.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="wrapper ml-10 overflow-hidden">
            <div className="flex items-center">
              <h1 className="text-4xl font-extrabold mr-5 line-clamp-1 ellipsis leading-tight">
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
            <div className="overflow-hidden mt-5">
              {userData.location && (
                <h1 className="text-lg">📍{userData.location}</h1>
              )}
            </div>

            <div className="flex flex-wrap">
              {userData.tags &&
                userData.tags.map((tag) => (
                  <Badge
                    className="mr-2 h-[20px] text-[13px] mt-4"
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {isProfileOwner && (
          <div className="mx-auto">
            <EditableQuote
              databaseContent={userData.quote}
              fieldName="quote"
              userIdParam={userId}
            />
          </div>
        )}
        {!isProfileOwner && (
          <div className="w-4/5 mx-auto relative rounded-lg border-l-8 border-l-gray-500 bg-gray-300 py-0 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“'] line-clamp-2">
            <p className="py-5">
              {userData.quote || "Hi, I'm new here. RE:Connect with me!"}
            </p>
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
