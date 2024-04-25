import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

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
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    </div>
  );
}
