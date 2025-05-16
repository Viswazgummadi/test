// src/features/habits/components/HabitItem.tsx
import React from "react";
import type { Habit, DayOfWeek } from "../../../types/habit";
import { isHabitDueToday, getTodayString } from "../../../utils/dateUtils"; // We'll create these utils
import "./HabitItem.css";

interface HabitItemProps {
  habit: Habit;
  onToggleComplete: (id: string) => void; // Toggles for today
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const todayStr = getTodayString();
  const isCompletedToday = habit.lastCompletedDate === todayStr;
  const dueToday = isHabitDueToday(habit);

  // Determine button text and disabled state
  let buttonText = "Mark as Done";
  let buttonDisabled = !dueToday;

  if (isCompletedToday) {
    buttonText = "Completed Today!";
    // Allow un-checking if completed today
    buttonDisabled = false;
  } else if (!dueToday) {
    buttonText = "Not Due Today";
  }

  const getFrequencyText = () => {
    if (habit.frequency === "specific_days" && habit.specificDays?.length) {
      return `Specific Days: ${habit.specificDays.join(", ")}`;
    }
    return habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
  };

  return (
    <li
      className={`habit-item ${isCompletedToday ? "completed" : ""} ${
        !dueToday && !isCompletedToday ? "not-due" : ""
      }`}
    >
      <div className="habit-info">
        <h3>{habit.name}</h3>
        {habit.description && (
          <p className="habit-description">{habit.description}</p>
        )}
        {habit.goal && (
          <p className="habit-goal">
            <em>Goal: {habit.goal}</em>
          </p>
        )}
        <p className="habit-frequency">Frequency: {getFrequencyText()}</p>
        <p className="habit-streak">
          Streak: {habit.streak} {habit.streak === 1 ? "day" : "days"}
        </p>
      </div>
      <div className="habit-actions">
        <button
          onClick={() => onToggleComplete(habit.id)}
          disabled={buttonDisabled}
          className={`toggle-complete-btn ${
            isCompletedToday ? "is-completed" : ""
          }`}
        >
          {buttonText}
        </button>
        <div className="habit-item-controls">
          <button onClick={() => onEdit(habit)} className="edit-btn">
            Edit
          </button>
          <button onClick={() => onDelete(habit.id)} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default HabitItem;
