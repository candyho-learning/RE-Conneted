import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "../utils/utils";
import { UserType } from "../interface/interfaces";
import EditableText from "../components/EditableText";
import { AuthContext } from "../context/authContext";
import ProfileSocialLinks from "../components/ProfileSocialLinks";

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
    <div className="user-profile-wrapper">
      <div className="profile-card">
        <img
          className="profile-pic"
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTM2OTIwNzN8&ixlib=rb-4.0.3&q=85"
        ></img>
        <h3>
          {userData.firstName} {userData.lastName}
        </h3>
        <EditableText
          fieldName="location"
          databaseContent={userData.location}
          userIdParam={userIdParam}
          isProfileOwner={isProfileOwner}
        />
        <EditableText
          fieldName="quote"
          databaseContent={userData.quote}
          userIdParam={userIdParam}
          isProfileOwner={isProfileOwner}
        />
        <hr />

        <div className="tag-selector wide">
          {userData.tags &&
            userData.tags.map((tag) => (
              <div key={tag} className="tag">
                {tag}
              </div>
            ))}
        </div>

        <hr />

        <ProfileSocialLinks
          userData={userData}
          hasSocialLinks={hasSocialLink}
        />

        {isProfileOwner && <a href="/settings">Go to profile settings</a>}
      </div>
      <div className="left">
        <div className="stats">
          <p>
            Joined since:{" "}
            {userData.accountCreatedTimestamp.toDate().toDateString()}
          </p>
        </div>
        <h4>Hosting Sessions</h4>

        <div className="future-sessions">
          {userData.futureSessions
            ?.filter((session) => session.role === "host")
            .map((session) => (
              <div className="session-card">
                <strong>
                  <p>{session.sessionName}</p>
                </strong>
                <p>{session.startTime.toDate().toLocaleString()}</p>
                <button>Join</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
