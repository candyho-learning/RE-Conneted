import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo-dark.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  return (
    <header className="sticky top-0 flex h-20 p-16 items-center gap-4 bg-background px-5 md:px-6 justify-between z-10 text-white w-full">
      <Link to="/">
        <img src={Logo} alt="Logo" className="w-44 mt-2 mr-40" />
      </Link>

      <nav className="hidden flex-col gap-6 text-md font-thin md:flex md:flex-row md:items-center md:gap-5 md:text-xl lg:gap-6">
        <Link
          to="/"
          className="text-brand-dark transition-colors hover:font-bold"
        >
          <h4>Home</h4>
        </Link>
        <Link
          to="/dashboard"
          className="text-brand-dark transition-colors hover:font-bold"
        >
          <h4>Dashboard</h4>
        </Link>
        <Link
          to="/community"
          className="text-brand-dark transition-colors hover:font-bold"
        >
          <h4>Community</h4>
        </Link>
        <Link
          to="/find-sessions"
          className="text-brand-dark transition-colors hover:font-bold"
        >
          <h4>Sessions</h4>
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        {isLoggedIn && user && (
          <>
            <h4 className="text-lg text-brand-dark font-bold tracking-wide">
              Welcome Back, {user.firstName}!
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/03.png" alt="Avatar" />
                    <AvatarFallback>
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/create-session">
                  <DropdownMenuLabel>Create a Session</DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/settings">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Manage My Sessions</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {!isLoggedIn && (
          <Link
            to="/login"
            className="text-white transition-colors hover:text-foreground font-medium text-lg"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </header>
  );
}
