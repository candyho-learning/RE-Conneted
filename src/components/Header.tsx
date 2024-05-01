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
    <header className="absolute top-0 flex h-20 items-center gap-4 bg-transparent px-4 md:px-6 justify-between z-10 text-white w-full">
      <img src={Logo} alt="Logo" className="w-44 mt-2 mr-10" />

      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-2xl lg:gap-6">
        <Link
          to="/"
          className="text-white transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="text-white transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          to="/community"
          className="text-white transition-colors hover:text-foreground"
        >
          Community
        </Link>
        <Link
          to="/find-sessions"
          className="text-white transition-colors hover:text-foreground"
        >
          Sessions
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        {isLoggedIn && user && (
          <>
            <p className="text-sm">Welcome Back, {user.firstName}!</p>
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
