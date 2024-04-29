import { useState, useRef, useEffect } from "react";
import { updateUserSessionGoal } from "../utils/utils";
import { GoalTrackerProps, GoalsType } from "../interface/interfaces";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
    const newGoal = { task: newTask, isDone: false, id: nextId.current++ };
    setAllGoals([...allGoals, newGoal]);
    setNewTask("");
  }

  useEffect(() => {
    //send to firebase
    updateUserSessionGoal(sessionId, userId, allGoals, userName);
  }, [allGoals]);

  function changeGoalStatus(goalId: number) {
    console.log("changing goal status");
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
    <div className="goal-tracker p-5 bg-gray-200 rounded-md w-96">
      <h3 className="text-xl font-semibold mb-2">What are your goals today?</h3>
      <div className="h-4/5 min-h-5">
        {allGoals.map((goal) => (
          <p
            style={{
              textDecorationLine: goal.isDone ? "line-through" : "none",
            }}
            onClick={() => {
              changeGoalStatus(goal.id);
            }}
            key={goal.id}
            className="text-lg hover:cursor-pointer"
          >
            {goal.task}
          </p>
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
