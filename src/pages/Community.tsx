import { UserType } from "../interface/interfaces";
import { getCollection } from "../utils/utils";

let allUsers: undefined | Array<UserType>;

async function loadUsers() {
  allUsers = await getCollection("users");
  console.log(allUsers);
}
loadUsers();

export default function Community() {
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
        </div>
      ))}
    </div>
  );
}
