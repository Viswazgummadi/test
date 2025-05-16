// src/features/gym/components/ExerciseLogger.tsx
import React from "react";
import type { ExerciseLog, GymSet } from "../../../types/Gym";
import SetInputRow from "./SetInputRow";
import "./ExerciseLogger.css";

interface ExerciseLoggerProps {
  exerciseLog: ExerciseLog; // The current state of this exercise log
  onUpdateExerciseLog: (updatedLog: ExerciseLog) => void; // Callback to update it in the parent (CurrentWorkout)
  onDeleteExercise: (exerciseId: string) => void;
}

const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({
  exerciseLog,
  onUpdateExerciseLog,
  onDeleteExercise,
}) => {
  const handleSetChange = (
    index: number,
    field: keyof Omit<GymSet, "id">,
    value: number
  ) => {
    const updatedSets = [...exerciseLog.sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    onUpdateExerciseLog({ ...exerciseLog, sets: updatedSets });
  };

  const handleAddSet = () => {
    const newSet: GymSet = {
      id: new Date().toISOString() + Math.random(),
      reps: 0,
      weight: 0,
    };
    onUpdateExerciseLog({
      ...exerciseLog,
      sets: [...exerciseLog.sets, newSet],
    });
  };

  const handleDeleteSet = (index: number) => {
    const updatedSets = exerciseLog.sets.filter((_, i) => i !== index);
    onUpdateExerciseLog({ ...exerciseLog, sets: updatedSets });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateExerciseLog({ ...exerciseLog, notes: e.target.value });
  };

  return (
    <div className="exercise-logger-card">
      <div className="exercise-logger-header">
        <h3>{exerciseLog.exerciseName}</h3>
        <button
          onClick={() => onDeleteExercise(exerciseLog.id)}
          className="delete-exercise-btn"
        >
          Remove Exercise
        </button>
      </div>

      {exerciseLog.sets.map((set, index) => (
        <SetInputRow
          key={set.id} // Important for React list rendering
          set={set}
          index={index}
          onSetChange={handleSetChange}
          onDeleteSet={handleDeleteSet}
        />
      ))}
      <button onClick={handleAddSet} className="add-set-btn">
        Add Set
      </button>

      <textarea
        placeholder="Notes for this exercise (e.g., form tips, how it felt)"
        value={exerciseLog.notes || ""}
        onChange={handleNotesChange}
        className="exercise-notes-input"
      />
    </div>
  );
};

export default ExerciseLogger;
