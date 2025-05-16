// src/features/workoutPlans/components/PlannedExerciseEditor.tsx
import React from "react";
import type {
  PlannedExerciseData,
  PlannedSetData,
} from "../../../types/gymPlan";
import "./PlannedExerciseEditor.css"; // Create this

interface PlannedExerciseEditorProps {
  exercise: PlannedExerciseData;
  index: number;
  onUpdateExercise: (
    index: number,
    updatedExercise: PlannedExerciseData
  ) => void;
  onDeleteExercise: (index: number) => void;
  // onMoveExerciseUp: (index: number) => void; // Optional: for reordering
  // onMoveExerciseDown: (index: number) => void; // Optional: for reordering
}

const PlannedExerciseEditor: React.FC<PlannedExerciseEditorProps> = ({
  exercise,
  index,
  onUpdateExercise,
  onDeleteExercise,
}) => {
  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateExercise(index, { ...exercise, exerciseName: e.target.value });
  };

  const handleSetChange = (
    setIndex: number,
    field: keyof Omit<PlannedSetData, "id" | "notes">,
    value: string
  ) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value ? parseInt(value) : undefined,
    };
    onUpdateExercise(index, { ...exercise, sets: updatedSets });
  };
  const handleSetNotesChange = (setIndex: number, value: string) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], notes: value };
    onUpdateExercise(index, { ...exercise, sets: updatedSets });
  };

  const handleAddSet = () => {
    const newSet: PlannedSetData = {
      id: new Date().toISOString() + "_set" + Math.random(),
      targetReps: undefined,
      targetWeight: undefined,
    };
    onUpdateExercise(index, { ...exercise, sets: [...exercise.sets, newSet] });
  };

  const handleDeleteSet = (setIndex: number) => {
    const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
    onUpdateExercise(index, { ...exercise, sets: updatedSets });
  };

  const handleExerciseNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdateExercise(index, { ...exercise, notes: e.target.value });
  };

  return (
    <div className="planned-exercise-editor">
      <h4>
        Exercise #{index + 1}
        <button
          type="button"
          onClick={() => onDeleteExercise(index)}
          className="delete-exercise-from-plan-btn"
        >
          Remove Exercise
        </button>
      </h4>
      <input
        type="text"
        placeholder="Exercise Name (e.g., Barbell Squats)"
        value={exercise.exerciseName}
        onChange={handleExerciseNameChange}
        className="exercise-name-input"
      />

      {exercise.sets.map((set, setIndex) => (
        <div key={set.id} className="planned-set-row">
          <span>Set {setIndex + 1}:</span>
          <input
            type="number"
            placeholder="Target Reps"
            value={set.targetReps ?? ""}
            onChange={(e) =>
              handleSetChange(setIndex, "targetReps", e.target.value)
            }
            min="0"
          />
          <span>x</span>
          <input
            type="number"
            placeholder="Target Wt."
            value={set.targetWeight ?? ""}
            onChange={(e) =>
              handleSetChange(setIndex, "targetWeight", e.target.value)
            }
            min="0"
            step="0.1"
          />
          <input
            type="text"
            placeholder="Set Notes (e.g., RPE 8)"
            value={set.notes ?? ""}
            onChange={(e) => handleSetNotesChange(setIndex, e.target.value)}
            className="set-notes-input"
          />
              <button
                  type = "button"
            onClick={() => handleDeleteSet(setIndex)}
            className="delete-planned-set-btn"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddSet}
        className="add-planned-set-btn"
      >
        Add Target Set
      </button>

      <textarea
        placeholder="Notes for this exercise in the plan (e.g., 'Warm-up well', 'Focus on tempo')"
        value={exercise.notes || ""}
        onChange={handleExerciseNotesChange}
        className="exercise-plan-notes-input"
      />
    </div>
  );
};

export default PlannedExerciseEditor;
