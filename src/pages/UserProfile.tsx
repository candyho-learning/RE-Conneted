import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "../utils/utils";
import { UserType } from "../interface/interfaces";
import EditableText from "../components/EditableText";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string | undefined }>();
  const [userData, setUserData] = useState<UserType>();
  console.log(userId);

  useEffect(() => {
    async function init(userId: string) {
      try {
        const data = await getUserData(userId);
        setUserData(data as UserType);
      } catch (err) {
        console.error(err);
        console.log("this user does not exist.");
      }
    }

    if (userId) {
      init(userId);
    }
  }, [userId]);

  if (!userData) {
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
        <EditableText placeholder="your quote here..." />
        <h4>📍</h4>
        <EditableText placeholder="your city?" />
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
                <p>{session.sessionId}</p>
                <p>
                  Session starts at:{" "}
                  {session.startTime.toDate().toLocaleString()}
                </p>
                <button>Join</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
