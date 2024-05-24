import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";

import { useLocation, useNavigate, Link } from "react-router-dom";
import Logo from "@/assets/logo-dark.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import friendsMainImage from "@/assets/friends.jpg";
import Loading from "@/components/Loading";

export default function Login() {
  const { login, isLoading, isLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("demo123456");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard"; // Default to dashboard or any other appropriate route

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const loginResult = await login(email, password);
    if (loginResult) {
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } else {
      setErrorMessage("Incorrect email or password. Please try again.");
    }
  }

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <Link to="/" className="absolute top-10 left-10">
        <img
          src={Logo}
          alt="Logo"
          className="w-44 mt-2 mr-40 hover:cursor-pointer"
        />
      </Link>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Log In</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="coworking@re-connected.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </a> */}
              </div>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          {errorMessage && (
            <div className="text-destructive">{errorMessage}</div>
          )}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={friendsMainImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
