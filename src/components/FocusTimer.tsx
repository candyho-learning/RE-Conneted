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
  const [currentTimeBlockIndex, setCurrentTimeBlockIndex] = useState(0);
  const [blockMin, setBlockMin] = useState<number>(
    timeBlocks[currentTimeBlockIndex].duration
  );
  const [secondsLeft, setSecondsLeft] = useState(blockMin * 60);
  const [displayTime, setDisplayTime] = useState(() =>
    toTimerDisplay(secondsLeft)
  );
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

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
      setSecondsLeft((prevSecondsLeft) => Math.max(0, prevSecondsLeft - 1));
    }, 1000);

    setTimerId(timer);

    return () => {
      console.log("timer interval clean up!");
      clearInterval(timer);
    };
  }, [isTimerActive, blockMin]);

  //chain2 - index -> blockMin
  useEffect(() => {
    console.log("changing block min", currentTimeBlockIndex);
    setBlockMin(timeBlocks[currentTimeBlockIndex].duration);
  }, [currentTimeBlockIndex]);

  //chain 3? blockMin -> secondsLeft

  useEffect(() => {
    console.log("changing secondsLeft");
    setSecondsLeft(blockMin * 60);
  }, [blockMin]);

  //2- when secondsLeft changes, also update the display
  //chain 1 - when secondsLeft hits 0 -> index
  //chain4 ? secondsLeft -> displayTime
  useEffect(() => {
    if (secondsLeft === 0) {
      if (currentTimeBlockIndex < timeBlocks.length - 1) {
        console.log(currentTimeBlockIndex);
        console.log("adding 1 to time block index");
        setCurrentTimeBlockIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log("timer ended, removing timer");
        clearInterval(timerId);
      }
    }
    setDisplayTime(toTimerDisplay(secondsLeft));
  }, [secondsLeft]);

  function toggleTimerState() {
    console.log("resetting timer state");
    setIsTimerActive((s) => !s);
  }

  return (
    <div className="timer">
      <h4>Current Time Block: {timeBlocks[currentTimeBlockIndex].type}</h4>
      <h1>
        {displayTime[0]}:{displayTime[1]}
      </h1>
      {currentTimeBlockIndex < timeBlocks.length - 1 && (
        <h4>Next:{timeBlocks[currentTimeBlockIndex + 1].type}</h4>
      )}
      <button onClick={toggleTimerState}>Pause/Go</button>
    </div>
  );
}
