import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo-dark.png";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  return (
    <header className="sticky top-0 flex h-20 p-12 items-center gap-4 bg-gray-100 px-5 md:px-6 justify-between z-10 text-brand-dark w-full shadow-md">
      <Link to="/">
        <img
          src={Logo}
          alt="Logo"
          className="w-44 mt-2 mr-40 hover:cursor-pointer"
        />
      </Link>

      <nav className="hidden flex-col gap-6 text-md font-thin md:flex md:flex-row md:items-center md:gap-5 md:text-xl lg:gap-6">
        <Link to="/dashboard" className=" transition-colors hover:font-bold">
          <h4>Dashboard</h4>
        </Link>
        <Link to="/community" className=" transition-colors hover:font-bold">
          <h4>Community</h4>
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
