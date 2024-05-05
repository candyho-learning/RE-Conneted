import Footer from "@/components/Footer";
import Hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo-light.png";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";

export default function Homepage() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  return (
    <div className="bg-background">
      <div className="relative h-screen">
        <img src={Logo} className="absolute top-10 left-10 w-60" />
        {!isLoggedIn && (
          <Link to="/login">
            <Button
              className="absolute top-10 right-10 text-white font-bold text-2xl"
              variant="ghost"
              size="lg"
            >
              <h4>Log In</h4>
            </Button>
          </Link>
        )}

        {isLoggedIn && user && (
          <div className="flex items-center absolute top-10 right-10">
            <h4 className="text-lg text-white font-bold tracking-wide mr-3">
              Welcome Back, {user.firstName}!
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full "
                >
                  <UserAvatar />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/create-session">
                  <DropdownMenuLabel>Create a Session</DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/dashboard">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    My Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Profile Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="hover:cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <img src={Hero} className="h-full w-full object-cover"></img>
        <div className="w-1/3 absolute top-36 left-40 text-white">
          <h1 className=" text-8xl font-extrabold leading-tight mb-5">
            Work Remotely, Stay Connected.
          </h1>
          <p className="w-4/5 font-extralight tracking-widest text-lg">
            A community for busy professionals to work, have fun, and connect.
          </p>

          <Link to="/signup">
            <Button className="mt-10 h-16 w-1/2 text-2xl font-semibold">
              JOIN FOR FREE
            </Button>
          </Link>
        </div>
      </div>
      <div></div>
      <Footer />
    </div>
  );
}
