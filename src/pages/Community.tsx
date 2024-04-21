import { useContext, useEffect, useState } from "react";
import { UserType } from "../interface/interfaces";
import { getCollection } from "../utils/utils";
import { AuthContext } from "../context/authContext";
import Login from "./Login";

export default function Community() {
  const { isLoggedIn } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<undefined | Array<UserType>>();
  useEffect(() => {
    async function loadUsers() {
      const data = await getCollection("users");
      console.log(allUsers);
      setAllUsers(data);
    }
    loadUsers();
  }, []);

  if (!isLoggedIn) return <Login context="force" />;

  return (
    <div>
      <h1>Community Page placeholder</h1>
      {allUsers?.map((user) => (
        <div key={user.userId}>
          <h3>
            {user.firstName} has {user?.futureSessions?.length || "no"} future
            sessions:
          </h3>
          {user.futureSessions &&
            user?.futureSessions.map((session) => (
              <>
                <a
                  href={`/coworking-session?type=default&id=${session.sessionId}`}
                >
                  {session.sessionId}
                </a>
                <br />
              </>
            ))}
          <a href={`/connect/${user.userId}`}>
            <button> Link to {user.firstName}'s profile</button>
          </a>
        </div>
      ))}
    </div>
  );
}
