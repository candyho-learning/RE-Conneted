import { useState, useRef, useEffect } from "react";
import { updateUserSessionGoal } from "../utils/utils";
import { GoalTrackerProps, GoalsType } from "../interface/interfaces";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CheckboxIcon, BoxIcon } from "@radix-ui/react-icons";

// const userId = '123'
// const sampleData = [
//   {
//     user: "91QwnJlmbNJBaAmhQtJwdv",
//     goals: [
//       { task: "Read a Book", isDone: true, id: 1 },
//       { task: "Sign Documents", isDone: false, id: 2 },
//     ],
//     joinTime: 31,
//     leaveTime: 55,
//   },
// ];

export default function GoalTracker({
  sessionId,
  userId,
  userName,
}: GoalTrackerProps) {
  const [allGoals, setAllGoals] = useState<Array<GoalsType>>([]);
  const [newTask, setNewTask] = useState("");
  let nextId = useRef(3);

  function addGoal() {
    if (newTask.length === 0) return;
    const newGoal = { task: newTask, isDone: false, id: nextId.current++ };
    setAllGoals([...allGoals, newGoal]);
    setNewTask("");
  }

  useEffect(() => {
    //send to firebase
    updateUserSessionGoal(sessionId, userId, allGoals, userName);
  }, [allGoals]);

  function changeGoalStatus(goalId: number) {
    setAllGoals(
      allGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            task: goal.task,
            id: goal.id,
            isDone: !goal.isDone,
          };
        } else {
          return goal;
        }
      })
    );
  }
  return (
    <div className="goal-tracker p-5 bg-gray-100 rounded-md w-96">
      <h3 className="text-xl font-semibold mb-2">What are your goals today?</h3>
      <div className="h-4/5 min-h-5 max-h-32 overflow-y-scroll">
        {allGoals.map((goal) => (
          <div
            className="flex items-center hover:cursor-pointer"
            onClick={() => {
              changeGoalStatus(goal.id);
            }}
          >
            {goal.isDone ? <CheckboxIcon /> : <BoxIcon />}
            <p
              style={{
                textDecorationLine: goal.isDone ? "line-through" : "none",
              }}
              key={goal.id}
              className={`${
                goal.isDone ? "line-through" : ""
              } text-lg ml-2 font-thin`}
            >
              {goal.task}
            </p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <Input
          type="text"
          name="new-goal"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
          }}
          className="border-black mr-1"
        />
        <Button
          onClick={addGoal}
          disabled={allGoals.length >= 5 ? true : false}
        >
          Add Goal
        </Button>
      </div>
    </div>
  );
}
