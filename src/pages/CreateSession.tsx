import React, { useContext, useRef, useState } from "react";
import { nanoid } from "nanoid";
import TimeBlockInput from "../components/TimeBlockInput";
import { TimeBlock } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import { addUserSession, createNewSession } from "../utils/utils";
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
import { useNavigate } from "react-router-dom";

const defaultBackground =
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTMyNzk5Mzl8&ixlib=rb-4.0.3&q=85";

export default function CreateSesssion() {
  const navigate = useNavigate();
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
      const thirtyMinsBeforeStartTime = new Date(
        formattedSessionStartTime.getTime() - 30 * 60 * 1000
      );
      const totalTimerDuration = timeBlocks.reduce(
        (acc, cur) => acc + cur.duration,
        0
      );
      const sessionEndTimtWithThirthyMinsBuffer = new Date(
        formattedSessionStartTime.getTime() +
          (totalTimerDuration + 30) * 60 * 1000
      );

      const sessionData = {
        sessionId: nanoid(),
        sessionName,
        startTime: formattedSessionStartTime,
        timeBlocks,
        host: userId,
        isTimerActive: false,
        backgroundImageUrl: backgroundImage,
        linkValidPeriod: {
          start: thirtyMinsBeforeStartTime,
          end: sessionEndTimtWithThirthyMinsBuffer,
        },
      };

      const userSessionData = {
        sessionId: sessionData.sessionId,
        role: "host",
      };
      await createNewSession(sessionData);
      await addUserSession(userId, userSessionData);
      resetForm();
      navigate("/dashboard");
    } else {
      console.log("nope");
      return;
    }
  }
  if (!isLoggedIn) return <Login />;

  return (
    //TODO split form in half, limit height
    <main
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
      }}
      className="p-20"
    >
      <Card className="mx-auto w-3/5 py-4 px-10">
        <CardHeader>
          <CardTitle className="text-6xl font-bold">
            Create a New Session
          </CardTitle>
          <CardDescription className="text-md">
            RE:Connected sesssions are designed to help you focus and connect
            with your friends. <br />
            You have the option to customize it however you want in 4 easy
            steps!
          </CardDescription>
        </CardHeader>
        <CardContent className=" w-1/2">
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-10">
              <Label className="font-bold text-xl">
                <h4>Session Name</h4>
              </Label>
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
              <Label className="font-bold text-xl">
                <h4>Session Start Time</h4>
              </Label>
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
                <h4>Choose a Backgroung Image</h4>
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
              <Label className="font-bold text-xl">
                <h4>Session Timer Setting</h4>
              </Label>
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
              <Button type="submit" size="lg" className="text-xl font-bold">
                Create Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
