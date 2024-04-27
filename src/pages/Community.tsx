import { useContext, useEffect, useState } from "react";
import { UserType } from "../interface/interfaces";
import { getCollection } from "../utils/utils";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TAGS } from "@/utils/settingsData";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Community() {
  const { isLoggedIn } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<undefined | Array<UserType>>();
  useEffect(() => {
    async function loadUsers() {
      const data = await getCollection("users");
      console.log(allUsers);
      setAllUsers(data);
    }
    loadUsers();
  }, []);

  if (!isLoggedIn) return <Login context="force" />;

  return (
    <div className="flex">
      <div className="side-bar left w-1/4  p-10">
        <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight mt-5">
          Feature Users
        </h2>
        <div className="featured-users space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            New Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Power Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Popular Users
          </Button>
        </div>
        <h2 className="px-4 text-xl font-semibold tracking-tight my-5">
          Filter by Tags
        </h2>
        <div className="tag-selector">
          {TAGS.map((tag) => (
            <Badge variant="secondary" className="m-2 h-[17px] text-[12px]">
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="px-4 text-xl font-semibold tracking-tight my-5">
          Explore Random Users
        </h2>
        <Button className="w-full" variant="outline">
          🎲 Surprise Me!
        </Button>
      </div>
      <div className="flex flex-wrap p-10">
        {allUsers?.map((user) => (
          <Card className="w-80 h-96 my-5 mx-5 relative">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Avatar className="w-28 h-28 static border-4 border-blue-400">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="ml-5 text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
              </div>

              <CardDescription className="italic">
                {user.quote ||
                  "Let's get some work done and have fun! RE:Connected with me."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap my-5 h-10">
                {user.tags?.map((tag) => (
                  <Badge
                    variant="secondary"
                    className="m-1 h-[15px] text-[11px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="absolute bottom-0">
              <Link to={`/connect/${user.userId}`}>
                <Button>See Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
