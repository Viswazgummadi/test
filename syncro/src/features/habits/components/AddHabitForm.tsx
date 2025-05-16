// src/features/habits/components/AddHabitForm.tsx
import React, { useState, useEffect } from "react";
import type { Habit, HabitFrequency, DayOfWeek } from "../../../types/habit";
import "./AddHabitForm.css";

interface AddHabitFormProps {
  onSaveHabit: (
    habit:
      | Omit<Habit, "id" | "lastCompletedDate" | "streak" | "createdAt">
      | Habit
  ) => void;
  onCancel: () => void;
  existingHabit?: Habit | null; // For editing
}

const allDaysOfWeek: DayOfWeek[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const AddHabitForm: React.FC<AddHabitFormProps> = ({
  onSaveHabit,
  onCancel,
  existingHabit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [specificDays, setSpecificDays] = useState<DayOfWeek[]>([]);
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (existingHabit) {
      setName(existingHabit.name);
      setDescription(existingHabit.description || "");
      setFrequency(existingHabit.frequency);
      setSpecificDays(existingHabit.specificDays || []);
      setGoal(existingHabit.goal || "");
    } else {
      // Reset for new habit
      setName("");
      setDescription("");
      setFrequency("daily");
      setSpecificDays([]);
      setGoal("");
    }
  }, [existingHabit]);

  const handleSpecificDayToggle = (day: DayOfWeek) => {
    setSpecificDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Habit name is required.");
      return;
    }
    if (frequency === "specific_days" && specificDays.length === 0) {
      alert("Please select at least one specific day for this frequency.");
      return;
    }

    const habitData = {
      name: name.trim(),
      description: description.trim(),
      frequency,
      specificDays: frequency === "specific_days" ? specificDays : [],
      goal: goal.trim(),
    };

    if (existingHabit) {
      onSaveHabit({ ...existingHabit, ...habitData });
    } else {
      onSaveHabit(habitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-habit-form">
      <h3>{existingHabit ? "Edit Habit" : "Add New Habit"}</h3>
      <div className="form-group">
        <label htmlFor="habitName">Name:</label>
        <input
          type="text"
          id="habitName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="habitDescription">Description (Optional):</label>
        <textarea
          id="habitDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="habitGoal">Goal (Optional, e.g., "10 minutes"):</label>
        <input
          type="text"
          id="habitGoal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="habitFrequency">Frequency:</label>
        <select
          id="habitFrequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="specific_days">Specific Days of the Week</option>
        </select>
      </div>

      {frequency === "specific_days" && (
        <div className="form-group specific-days-group">
          <label>Select Days:</label>
          <div className="days-checkboxes">
            {allDaysOfWeek.map((day) => (
              <label key={day} className="day-checkbox-label">
                <input
                  type="checkbox"
                  value={day}
                  checked={specificDays.includes(day)}
                  onChange={() => handleSpecificDayToggle(day)}
                />{" "}
                {day}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {existingHabit ? "Save Changes" : "Add Habit"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm;
