import { useContext, useEffect, useState } from "react";
import { SessionDataType } from "../interface/interfaces";
import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/authContext";
import { Button } from "./ui/button";
import { syncFocusTimer } from "@/utils/utils";

export default function FocusTimer(sessionData: SessionDataType) {
  const { userId } = useContext(AuthContext);

  const timeBlocks = sessionData.timeBlocks;
  const timerTotalTime = timeBlocks.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  const [currentTimeBlockIndex, setCurrentTimeBlockIndex] = useState(
    sessionData?.currentTimeBlockIndex || 0
  );
  const [secondsLeft, setSecondsLeft] = useState(
    sessionData?.currentSecondsLeft ||
      timeBlocks[currentTimeBlockIndex].duration * 60
  );
  const [displayTime, setDisplayTime] = useState(() =>
    toTimerDisplay(secondsLeft)
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(
    sessionData.isTimerActive
  );
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
  const [timerStartState, setTimerStartState] = useState(
    sessionData?.timerStartState || "not started"
  );
  const [progress, setProgress] = useState<Array<number>>(
    Array(timeBlocks.length).fill(0)
  );

  const [shouldSyncTimer, setShouldSyncTimer] = useState(false);

  function toTimerDisplay(secs: number) {
    const minute = Math.floor(secs / 60);
    const second = (secs % 60).toString().padStart(2, "0");
    return [minute, second];
  }

  function syncTimer() {
    console.log("button pressed");
    console.log(timerStartState);
    if (userId === sessionData.host && timerStartState === "started") {
      console.log(
        "Current timer: block",
        { currentTimeBlockIndex },
        { secondsLeft },
        "seconds left."
      );

      //upload to firebase
      (async () => {
        const result = await syncFocusTimer(
          sessionData.sessionId,
          currentTimeBlockIndex,
          secondsLeft
        );
        if (result) {
          console.log("uploaded timer successfully");
        } else {
          console.log("timer sync failed");
        }
      })();
    }
  }

  //onsnapshot listener to detect when new users join the call
  useEffect(() => {
    const subcollectionRef = collection(
      db,
      "sessions",
      sessionData.sessionId,
      "participantActivities"
    );
    const unsubscribe = onSnapshot(subcollectionRef, (_snapshot) => {
      console.log("someone joined the call");
      setShouldSyncTimer(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsTimerActive(sessionData.isTimerActive);
  }, [sessionData.isTimerActive]);

  useEffect(() => {
    if (sessionData.currentTimeBlockIndex) {
      setCurrentTimeBlockIndex(sessionData.currentTimeBlockIndex);
      console.log("timer index updated");
    }
    if (sessionData.currentSecondsLeft !== undefined) {
      setSecondsLeft(sessionData.currentSecondsLeft);
      console.log("timer seconds updated");
      console.log(sessionData.currentSecondsLeft);
    }
  }, [sessionData.currentSecondsLeft, sessionData.currentTimeBlockIndex]);

  //1 - if timer is not paused, take 1 sec off seconds left every second
  useEffect(() => {
    // console.log("restarting timer", currentTimeBlockIndex);

    const timer = setInterval(() => {
      // console.log("1s passed", isTimerActive);
      isTimerActive &&
        setSecondsLeft((prevSecondsLeft) => Math.max(0, prevSecondsLeft - 1));
    }, 1000);

    setTimerId(timer);

    return () => {
      // console.log("timer interval clean up!");
      clearInterval(timer);
    };
  }, [isTimerActive, currentTimeBlockIndex]);

  useEffect(() => {
    // console.log("changing block min", currentTimeBlockIndex);
    isTimerActive &&
      setSecondsLeft(timeBlocks[currentTimeBlockIndex].duration * 60);
    console.log("setting seconds left according to block index");
  }, [currentTimeBlockIndex]);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (currentTimeBlockIndex < timeBlocks.length - 1) {
        // console.log(currentTimeBlockIndex);
        // console.log("adding 1 to time block index");
        setCurrentTimeBlockIndex((prevIndex) => prevIndex + 1);
      } else {
        // console.log("timer ended, removing timer");
        // console.log("timer end time", Date.now());
        syncTimer();
        setTimerStartState("ended");
        setIsTimerActive(false);
        clearInterval(timerId);
      }
    }
    setDisplayTime(toTimerDisplay(secondsLeft));
    setProgress(
      progress.map((item, i) => {
        if (i === currentTimeBlockIndex) {
          const totalBlockTime =
            timeBlocks[currentTimeBlockIndex].duration * 60;
          return (totalBlockTime - secondsLeft) / totalBlockTime;
        } else {
          return item;
        }
      })
    );
  }, [secondsLeft]);

  function toggleTimerState() {
    if (timerStartState === "ended") {
      return;
    }
    // console.log("resetting timer state");
    setTimerStartState("started");
    setIsTimerActive((s) => !s);
    syncTimer();
  }

  useEffect(() => {
    const sessionRef = doc(db, "sessions", sessionData.sessionId);
    async function updateIsTimerActive() {
      await updateDoc(sessionRef, {
        isTimerActive,
      });
    }

    updateIsTimerActive();
  }, [isTimerActive]);

  useEffect(() => {
    const sessionRef = doc(db, "sessions", sessionData.sessionId);
    async function updateTimerStartState() {
      await updateDoc(sessionRef, {
        timerStartState,
      });
    }

    if (userId === sessionData.host) {
      updateTimerStartState();
      console.log("timer start state updated");
    }
  }, [timerStartState]);

  useEffect(() => {
    if (shouldSyncTimer) {
      syncTimer();
      setShouldSyncTimer(false);
    }
  }, [shouldSyncTimer]);

  return (
    <div className="timer text-black mb-10 w-96 bg-gray-100 rounded-md">
      <div className="h-6 flex relative">
        {timeBlocks.map((block, i) => (
          <div
            key={block.id}
            style={{
              width: `${(block.duration / timerTotalTime) * 100}%`,
            }}
            className="bg-white border border-gray-400 relative overflow-hidden"
          >
            {/* Progress bar */}
            <div
              className={`h-6 ${
                block.type === "deep-work"
                  ? "bg-timeblock-deepWork"
                  : block.type === "rest"
                  ? "bg-timeblock-rest"
                  : block.type === "ice-breaking"
                  ? "bg-timeblock-iceBreaking"
                  : "bg-timeblock-freeChat"
              } text-sm text-gray-400 transition-width duration-300 ease-in-out absolute inset-0`}
              style={{
                width:
                  i < currentTimeBlockIndex ? "100%" : `${progress[i] * 100}%`,
              }}
            ></div>
            {/* Overlay text */}
            <p className="absolute inset-0 flex items-center justify-center z-10 text-center text-gray-400">
              {block.duration}
            </p>
          </div>
        ))}
      </div>
      <div className="p-10">
        <h4>Current Time Block: {timeBlocks[currentTimeBlockIndex].type}</h4>
        <h1 className="text-6xl font-bold my-5 tracking-wide">
          {displayTime[0]} : {displayTime[1]}
        </h1>

        <div className="flex justify-between items-end">
          {userId === sessionData.host && (
            <Button
              onClick={toggleTimerState}
              className="text-white"
              size="icon"
            >
              {isTimerActive ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </Button>
          )}
          {currentTimeBlockIndex < timeBlocks.length - 1 && (
            <h4>Next: {timeBlocks[currentTimeBlockIndex + 1].type}</h4>
          )}
          <button onClick={syncTimer}>Sync</button>
          <p>{timerStartState}</p>
        </div>
      </div>
    </div>
  );
}
