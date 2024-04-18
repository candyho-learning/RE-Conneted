import { useEffect, useState } from "react";
import { TimeBlock } from "../interface/interfaces";
export default function FocusTimer() {
  //this will need to be passed as a prop
  //for testing, I'm using floats
  const timeBlocks: Array<TimeBlock> = [
    { type: "ice-breaking", duration: 0.1 },
    { type: "deep-work", duration: 0.2 },
    { type: "rest", duration: 0.1 },
  ];
  const timerTotalTime = timeBlocks.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  const [currentTimeBlockIndex, setCurrentTimeBlockIndex] = useState(0);
  //   const [blockMin, setBlockMin] = useState<number>(
  //     timeBlocks[currentTimeBlockIndex].duration
  //   );
  const [secondsLeft, setSecondsLeft] = useState(
    timeBlocks[currentTimeBlockIndex].duration * 60
  );
  const [displayTime, setDisplayTime] = useState(() =>
    toTimerDisplay(secondsLeft)
  );
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
  const [timerStartState, setTimerStartState] = useState("not started");
  const [progress, setProgress] = useState<Array<number>>(
    Array(timeBlocks.length).fill(0)
  );

  function toTimerDisplay(secs: number) {
    const minute = Math.floor(secs / 60);
    const second = (secs % 60).toString().padStart(2, "0");
    return [minute, second];
  }

  //1 - if timer is not paused, take 1 sec off seconds left every second
  useEffect(() => {
    console.log("restarting timer", currentTimeBlockIndex);

    const timer = setInterval(() => {
      console.log("1s passed", isTimerActive);
      isTimerActive &&
        setSecondsLeft((prevSecondsLeft) => Math.max(0, prevSecondsLeft - 1));
    }, 1000);

    setTimerId(timer);

    return () => {
      console.log("timer interval clean up!");
      clearInterval(timer);
    };
  }, [isTimerActive, currentTimeBlockIndex]);

  useEffect(() => {
    console.log("changing block min", currentTimeBlockIndex);
    setSecondsLeft(timeBlocks[currentTimeBlockIndex].duration * 60);
  }, [currentTimeBlockIndex]);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (currentTimeBlockIndex < timeBlocks.length - 1) {
        console.log(currentTimeBlockIndex);
        console.log("adding 1 to time block index");
        setCurrentTimeBlockIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log("timer ended, removing timer");
        setTimerStartState("ended");
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
    console.log("resetting timer state");
    setTimerStartState("started");
    setIsTimerActive((s) => !s);
  }

  return (
    <div className="timer">
      <div className="progress-bar">
        {timeBlocks.map((block, i) => (
          <div
            key={block.id}
            style={{
              width: `${(block.duration / timerTotalTime) * 100}%`,
              backgroundColor: "white",
              border: "1px solid darkgrey",
            }}
          >
            <div
              className="solid-progress"
              style={{
                width: `${progress[i] * 100}%`,
                transition: "width .3s ease-in-out",
              }}
            ></div>
          </div>
        ))}
      </div>
      <h4>Current Time Block: {timeBlocks[currentTimeBlockIndex].type}</h4>
      <h1>
        {displayTime[0]}:{displayTime[1]}
      </h1>
      {currentTimeBlockIndex < timeBlocks.length - 1 && (
        <h4>Next:{timeBlocks[currentTimeBlockIndex + 1].type}</h4>
      )}
      <button onClick={toggleTimerState}>Start/Pause</button>
    </div>
  );
}
