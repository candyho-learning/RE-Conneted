import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <ul style={{ display: "flex" }}>
        <a href="/dashboard">
          <li>Dashboard</li>
        </a>
        <a href="/signup">
          <li>SignUp</li>
        </a>
        <a href="/login">
          <li>Log In</li>
        </a>
        <a href="/">
          <li>HomePage</li>
        </a>
        <a href="/community">
          <li>Community</li>
        </a>
        {isLoggedIn && user && (
          <a onClick={logout}>Hi {user.firstName}! Log Out Here</a>
        )}
        {!isLoggedIn && <a href="/login">Log in here</a>}
      </ul>
    </div>
  );
}
