import React, { useContext, useRef, useState } from "react";
import { nanoid } from "nanoid";
import TimeBlockInput from "../components/TimeBlockInput";
import { TimeBlock } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import { addFutureSession, createNewSession } from "../utils/utils";
import Login from "./Login";
import BackgroundPicker from "../components/BackgroundPicker";

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
    <div style={{ width: "55%" }}>
      <h1>Create a New Session</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Session Name</label>
          <input
            type="text"
            name="session-name"
            required
            value={sessionName}
            onChange={(e) => {
              setSessionName(e.target.value);
            }}
          />
          {!hasSessionName && (
            <p className="warning">Must contain as least 5 characters.</p>
          )}
        </div>
        <div>
          <label>Session Start Time</label>
          <input
            type="datetime-local"
            name="session-start-time"
            value={sessionStartTime}
            onChange={(e) => {
              setSessionStartTime(e.target.value);
            }}
          />
          {!isStartTimeValid && (
            <p className="warning">Start time must be in the future.</p>
          )}
        </div>
        <BackgroundPicker
          setBackgroundImage={setBackgroundImage}
          backgroundImage={backgroundImage}
        />
        <div>
          <h4>Session Timer Setting</h4>
          {timeBlocks.map((timeBlock) => (
            <TimeBlockInput
              key={timeBlock.id}
              id={timeBlock.id}
              setTimeBlocks={setTimeBlocks}
              timeBlocks={timeBlocks}
            />
          ))}
        </div>
        <button onClick={createNewTimeBlock} style={{ marginTop: "20px" }}>
          Add Another Time Block
        </button>
        {!isTimerValid && (
          <p className="warning">
            To enjoy the best RE:Conneted experience, sessions should be between
            30~180 mins.
          </p>
        )}

        <button
          type="submit"
          className="highlight"
          style={{ marginTop: "20px" }}
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
