import { useState, useRef, useEffect } from "react";
import { updateUserSessionGoal } from "../utils/utils";
import { GoalTrackerProps, GoalsType } from "../interface/interfaces";

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

export default function GoalTracker({ sessionId, userId }: GoalTrackerProps) {
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
    updateUserSessionGoal(sessionId, userId, allGoals);
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
    <div className="goal-tracker">
      {allGoals.map((goal) => (
        <p
          style={{ textDecorationLine: goal.isDone ? "line-through" : "none" }}
          onClick={() => {
            changeGoalStatus(goal.id);
          }}
          key={goal.id}
        >
          {goal.task}
        </p>
      ))}
      <input
        type="text"
        name="new-goal"
        value={newTask}
        onChange={(e) => {
          setNewTask(e.target.value);
        }}
      />
      <button onClick={addGoal} disabled={allGoals.length >= 5 ? true : false}>
        Add Goal
      </button>
    </div>
  );
}
