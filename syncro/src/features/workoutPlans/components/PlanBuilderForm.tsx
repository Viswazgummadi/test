// src/features/workoutPlans/components/PlanBuilderForm.tsx
import React, { useState, useEffect } from "react";
import type {
  WorkoutPlan,
  PlannedExerciseData,
  PlannedSetData,
  DayOfWeek,
} from "../../../types/gymPlan";

import PlannedExerciseEditor from "./PlannedExerciseEditor";
import "./PlanBuilderForm.css"; // Create this

interface PlanBuilderFormProps {
  initialPlan?: WorkoutPlan | null;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}
const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PlanBuilderForm: React.FC<PlanBuilderFormProps> = ({
  initialPlan,
  onSave,
  onCancel,
}) => {
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [assignedDayOfWeek, setAssignedDayOfWeek] = useState<
    DayOfWeek | null | undefined
  >(undefined);

  const [exercises, setExercises] = useState<PlannedExerciseData[]>([]);

  useEffect(() => {
    if (initialPlan) {
      setPlanName(initialPlan.name);
      setPlanDescription(initialPlan.description || "");
      setAssignedDayOfWeek(initialPlan.assignedDayOfWeek);
      setExercises(
        initialPlan.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({
            ...s,
            id:
              s.id || new Date().toISOString() + "_initialSet" + Math.random(),
          })),
        }))
      );
    } else {
      // Default for new plan
      setPlanName("");
      setPlanDescription("");
      setAssignedDayOfWeek(undefined); // Or null, or a default like 'Monday'
      setExercises([]);
    }
  }, [initialPlan]);

  const handleAddExercise = () => {
    const newExercise: PlannedExerciseData = {
      id: new Date().toISOString() + "_ex" + Math.random(),
      exerciseName: "",
      order: exercises.length,
      sets: [
        {
          id: new Date().toISOString() + "_set" + Math.random(),
          targetReps: undefined,
          targetWeight: undefined,
        },
      ], // Start with one empty set
      notes: "",
    };
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (
    index: number,
    updatedExercise: PlannedExerciseData
  ) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  const handleDeleteExercise = (index: number) => {
    const newExercises = exercises
      .filter((_, i) => i !== index)
      .map((ex, newOrder) => ({ ...ex, order: newOrder })); // Re-order
    setExercises(newExercises);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) {
      alert("Plan name is required.");
      return;
    }
    if (exercises.some((ex) => !ex.exerciseName.trim())) {
      alert("All exercises must have a name.");
      return;
    }

    const finalPlan: WorkoutPlan = {
      id:
        initialPlan?.id ||
        new Date().toISOString() + "_planSubmit" + Math.random(), // Ensure ID for new plans too
      name: planName,
      description: planDescription,
      exercises: exercises.map((ex, index) => ({ ...ex, order: index })), // Ensure order is sequential
    };
    onSave(finalPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="plan-builder-form">
      <h2>{initialPlan ? "Edit Workout Plan" : "Create New Workout Plan"}</h2>
      <div className="form-group">
        <label htmlFor="planName">Plan Name:</label>
        <input
          type="text"
          id="planName"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="planDescription">Description (Optional):</label>
        <textarea
          id="planDescription"
          value={planDescription}
          onChange={(e) => setPlanDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="assignedDayOfWeek">Assign to Day (Optional):</label>
        <select
          id="assignedDayOfWeek"
          value={assignedDayOfWeek || ""} // Handle undefined/null for the select value
          onChange={(e) =>
            setAssignedDayOfWeek((e.target.value as DayOfWeek) || undefined)
          }
        >
          <option value="">-- Select a Day --</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <h3>Exercises:</h3>
      {exercises.map((exercise, index) => (
        <PlannedExerciseEditor
          key={exercise.id} // Make sure this ID is stable if you reorder
          exercise={exercise}
          index={index}
          onUpdateExercise={handleUpdateExercise}
          onDeleteExercise={handleDeleteExercise}
        />
      ))}

      <button
        type="button"
        onClick={handleAddExercise}
        className="add-exercise-to-plan-btn"
      >
        Add Exercise to Plan
      </button>

      <div className="form-actions">
        <button type="submit" className="save-plan-btn">
          Save Plan
        </button>
        <button type="button" onClick={onCancel} className="cancel-plan-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PlanBuilderForm;
