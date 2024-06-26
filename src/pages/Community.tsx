import { useEffect, useState } from "react";
import { UserType } from "../interface/interfaces";
import { getCollection } from "../utils/utils";
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
  const [allUsers, setAllUsers] = useState<undefined | Array<UserType>>();
  const [filterTags, setFilterTags] = useState<Array<string>>([]);
  const [filteredUsers, setFilteredUsers] = useState<
    undefined | Array<UserType>
  >();
  useEffect(() => {
    async function loadUsers() {
      const data = await getCollection("users");
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
    const randomUser = userArr[randomIndex].userId;
    navigate(`/connect/${randomUser}`);
  }

  // if (!isLoggedIn) return <Login />;

  return (
    <div className="flex py-10 px-10">
      <div className="side-bar left w-[400px] p-10 grow-0 bg-gray-400 text-brand-lightgrey rounded-3xl h-screen">
        <div className="flex items-center mb-5">
          <h2 className="px-4 text-md font-thin tracking-tight">
            Filter by Tags
          </h2>
          <Button
            size="sm"
            variant="secondary"
            className="h-[16px]"
            onClick={() => {
              setFilterTags([]);
            }}
          >
            Reset
          </Button>
        </div>

        <div className="tag-selector mb-10">
          {TAGS.map((tag) => (
            <Badge
              className={`bg-gray-300 m-2 h-[24px] text-[12px] font-normal hover:cursor-pointer rounded-xl ${
                filterTags.includes(tag) ? "bg-brand-yellow" : ""
              }`}
              onClick={() => {
                toggleSelectedTags(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="px-4 text-md font-thin tracking-tight my-2">
          Visit A Random User
        </h2>
        <Button
          className="w-full h-12 group border-none"
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
      <div className="grid px-10 pt-0  w-min-[500px] grid-cols-2 3xl:grid-cols-3">
        {filteredUsers?.length === 0 && (
          <Alert className="border w-1/3 h-fit border-primary mx-auto my-40 p-3 scale-150">
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
          <Card className="w-80 h-96 mb-10 mx-5 relative bg-transparent border-brand-darkgrey rounded-3xl">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Avatar className="w-24 h-24 static bg-brand-mutedblue border-2 border-white flex justify-center items-center">
                  <AvatarImage
                    src={`/avatars/avatar${user?.avatar}.png`}
                    alt="user avatar"
                    className="w-4/5 h-4/5 object-contain"
                  />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="ml-5 text-lg line-clamp-2">
                  {user.firstName} {user.lastName}
                </CardTitle>
              </div>

              <CardDescription className="italic line-clamp-2">
                {user.quote ||
                  "Let's get some work done and have fun! RE:Connected with me."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap my-5 h-10">
                {user.tags?.map((tag) => (
                  <Badge className="m-1 h-[18px] text-[12px] bg-white font-normal">
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
