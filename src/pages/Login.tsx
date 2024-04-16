import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
type LoginProps = {
  context?: string;
};
export default function Login({ context }: LoginProps) {
  const { login, isLoggedIn, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
    setEmail("");
    setPassword("");
  }
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <h1>You are now {isLoggedIn ? "logged in" : "logged out"}</h1>
      )}
      <h1>
        {!isLoggedIn &&
          (context === "normal"
            ? "Welcome Back"
            : "Please Log In to Continue...")}
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
