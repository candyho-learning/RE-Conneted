import React, { useContext, useRef, useState } from "react";
import { nanoid } from "nanoid";
import TimeBlockInput from "../components/TimeBlockInput";
import { TimeBlock } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import { addFutureSession, createNewSession } from "../utils/utils";
import Login from "./Login";
import BackgroundPicker from "../components/BackgroundPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const defaultBackground =
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTMyNzk5Mzl8&ixlib=rb-4.0.3&q=85";

export default function CreateSesssion() {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const [sessionName, setSessionName] = useState<string>("");
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
  let nextId = useRef(1);
  const [timeBlocks, setTimeBlocks] = useState<Array<TimeBlock>>([
    {
      type: "deep-work",
      duration: 45,
      id: 0,
    },
  ]);

  //validation rules
  const formattedSessionStartTime = new Date(sessionStartTime);
  const totalTimerDuration = timeBlocks.reduce(
    (acc, cur) => acc + cur.duration,
    0
  );

  const hasSessionName = sessionName.length >= 5;
  const isStartTimeValid = formattedSessionStartTime > new Date();
  const isTimerValid = totalTimerDuration >= 30 && totalTimerDuration <= 180;

  function resetForm() {
    setSessionName("");
    setSessionStartTime("");
    setBackgroundImage(defaultBackground);
    setTimeBlocks([
      {
        type: "deep-work",
        duration: 45,
        id: 0,
      },
    ]);
    nextId.current = 1;
  }

  function createNewTimeBlock(e: React.MouseEvent) {
    e.preventDefault();
    const newTimeBlock = {
      type: "rest",
      duration: 45,
      id: nextId.current++,
    };
    setTimeBlocks([...timeBlocks, newTimeBlock]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hasSessionName && isStartTimeValid && isTimerValid) {
      const sessionData = {
        sessionId: nanoid(),
        sessionName,
        startTime: formattedSessionStartTime,
        timeBlocks,
        host: userId,
        isTimerActive: false,
        backgroundImageUrl: backgroundImage,
      };

      const futureSessionData = {
        sessionId: sessionData.sessionId,
        sessionName,
        role: "host",
        startTime: formattedSessionStartTime,
      };
      await createNewSession(sessionData);
      await addFutureSession(userId, futureSessionData);
      resetForm();
    } else {
      console.log("nope");
      return;
    }
  }
  if (!isLoggedIn) return <Login context="force" />;

  return (
    <main
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
      }}
      className="p-20"
    >
      <Card className="mx-auto w-2/5 py-10 bg-white">
        <CardHeader>
          <CardTitle className="text-6xl font-bold">
            Create a New Session
          </CardTitle>
          <CardDescription>
            RE:Connected sesssions are designed to help you focus and connect
            with your friends. <br />
            You have the option to customize it however you want in 4 easy
            steps!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-10">
              <Label className="font-bold text-xl">Session Name</Label>
              <Input
                type="text"
                name="session-name"
                required
                value={sessionName}
                onChange={(e) => {
                  setSessionName(e.target.value);
                }}
              />
              {!hasSessionName && (
                <p className="text-destructive">
                  Must contain as least 5 characters.
                </p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-10">
              <Label className="font-bold text-xl">Session Start Time</Label>
              <Input
                className="w-fit"
                type="datetime-local"
                name="session-start-time"
                value={sessionStartTime}
                onChange={(e) => {
                  setSessionStartTime(e.target.value);
                }}
              />
              {!isStartTimeValid && (
                <p className="text-destructive">
                  Start time must be in the future.
                </p>
              )}
            </div>
            <div className="w-full mb-10">
              <Label className="font-bold text-xl">
                Choose a Backgroung Image
              </Label>
              {backgroundImage && (
                <img className="w-1/3 mt-3" src={backgroundImage}></img>
              )}
              <div className="mt-5">
                <BackgroundPicker
                  setBackgroundImage={setBackgroundImage}
                  backgroundImage={backgroundImage}
                />
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-10">
              <Label className="font-bold text-xl">Session Timer Setting</Label>
              {timeBlocks.map((timeBlock) => (
                <TimeBlockInput
                  key={timeBlock.id}
                  id={timeBlock.id}
                  setTimeBlocks={setTimeBlocks}
                  timeBlocks={timeBlocks}
                />
              ))}
            </div>
            <Button
              onClick={createNewTimeBlock}
              variant="secondary"
              className="mb-2"
            >
              Add Another Time Block
            </Button>
            {!isTimerValid && (
              <p className="text-destructive">
                To enjoy the best RE:Conneted experience, sessions should be
                between 30~180 mins.
              </p>
            )}
            <div className="mt-20">
              <Button type="submit" size="lg">
                Create Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
