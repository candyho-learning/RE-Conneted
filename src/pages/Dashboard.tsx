import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
export default function Dashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) return <Login context="force" />;
  return (
    <div style={{ backgroundColor: "pink" }}>
      <h1>Dashboard Placeholder</h1>
      <h1>
        You are {user?.firstName} {user?.lastName}
      </h1>
      <a href="/create-session">
        <button>Create a New Session</button>
      </a>
    </div>
  );
}
