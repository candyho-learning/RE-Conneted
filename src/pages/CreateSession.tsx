import React, { useContext, useRef, useState } from "react";
import { nanoid } from "nanoid";
import TimeBlockInput from "../components/TimeBlockInput";
import { TimeBlock } from "../interface/interfaces";
import { AuthContext } from "../context/authContext";
import { addFutureSession, createNewSession } from "../utils/utils";

export default function CreateSesssion() {
  const { userId } = useContext(AuthContext);
  const [sessionName, setSessionName] = useState<string>("");
  const [sessionStartTime, setSessionStartTime] = useState("");
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
      };

      const futureSessionData = {
        sessionId: sessionData.sessionId,
        role: "host",
        userId,
        startTime: formattedSessionStartTime,
      };
      await createNewSession(sessionData);
      await addFutureSession(futureSessionData);
      resetForm();
    } else {
      console.log("nope");
      return;
    }
  }
  return (
    <div>
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
