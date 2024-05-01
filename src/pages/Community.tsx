import { useContext, useEffect, useState } from "react";
import { UserType } from "../interface/interfaces";
import { getCollection } from "../utils/utils";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TAGS } from "@/utils/settingsData";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Community() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<undefined | Array<UserType>>();
  const [filterTags, setFilterTags] = useState<Array<string>>([]);
  const [filteredUsers, setFilteredUsers] = useState<
    undefined | Array<UserType>
  >();
  useEffect(() => {
    async function loadUsers() {
      const data = await getCollection("users");
      console.log(allUsers);
      setAllUsers(data);
      setFilteredUsers(data);
    }
    loadUsers();
  }, []);

  //filter users
  useEffect(() => {
    if (allUsers) {
      let filtered = [...allUsers];
      if (filterTags.length === 0) {
        setFilteredUsers(filtered);
        return;
      }
      for (let tag of filterTags) {
        filtered = filtered?.filter((user) => user.tags?.includes(tag));
      }
      setFilteredUsers(filtered);
    }
  }, [filterTags]);

  function toggleSelectedTags(tagName: string) {
    console.log(tagName);
    if (filterTags.includes(tagName)) {
      //tag already selected -> remove from list
      setFilterTags(filterTags.filter((tag) => tag !== tagName));
    } else {
      //tag not yet selected -> add to list
      if (filterTags.length >= 5) return;

      setFilterTags((prevList) => [...prevList, tagName]);
    }
  }

  function visitRandomProfile(userArr: Array<UserType>) {
    const randomIndex = Math.floor(Math.random() * userArr.length);
    console.log(randomIndex);
    const randomUser = userArr[randomIndex].userId;
    navigate(`/connect/${randomUser}`);
  }

  if (!isLoggedIn) return <Login context="force" />;

  return (
    <div className="flex py-10 px-12">
      <div className="side-bar left w-[500px] p-10 grow-0 bg-brand-darkgrey text-brand-lightgrey">
        <h2 className="mb-4 px-4 text-3xl font-bold tracking-tight mt-5">
          Featured Users
        </h2>
        <div className="featured-users space-y-1">
          <Button variant="ghost" className=" w-full justify-start text-lg">
            New Users
          </Button>
          <Button variant="ghost" className=" w-full justify-start text-lg">
            Power Users
          </Button>
          <Button variant="ghost" className=" w-full justify-start text-lg">
            Popular Users
          </Button>
        </div>
        <h2 className="px-4 text-3xl font-bold tracking-tight my-10">
          Filter by Tags
        </h2>
        <div className="tag-selector">
          {TAGS.map((tag) => (
            <Badge
              variant="secondary"
              className={`m-2 h-[33px] text-[18px] hover:cursor-pointer rounded-xl ${
                filterTags.includes(tag) ? "bg-brand-lightblue" : ""
              }`}
              onClick={() => {
                toggleSelectedTags(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="px-4 text-3xl font-bold tracking-tight my-10">
          Visit A Random User
        </h2>
        <Button
          className="w-full h-12 group"
          variant="outline"
          onClick={() => {
            allUsers && visitRandomProfile(allUsers);
          }}
        >
          <p className="mr-5 text-xl group-hover:animate-roll-dice">🎲</p>
          <p className="text-lg group-hover:scale-110 text-brand-dark font-semibold">
            Surprise Me!
          </p>
        </Button>
      </div>
      <div className="flex flex-wrap p-10 pt-0 flex-grow-1 w-min-[500px] basis-4/5">
        {filteredUsers?.length === 0 && (
          <Alert className="border w-1/3 h-fit border-primary mx-auto my-auto p-3 scale-150">
            <ChatBubbleIcon className="h-4 w-4 p-0" />
            <AlertTitle className="font-semibold">
              Seems like we're out of matches!
            </AlertTitle>
            <AlertDescription className="text-gray-600">
              Adjust your tags and try again?
            </AlertDescription>
          </Alert>
        )}
        {filteredUsers?.map((user) => (
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
