// src/features/gym/components/CurrentWorkout.tsx
import React, { useState } from "react";
// import type { WorkoutSession, ExerciseLog, GymSet } from "../../../types/Gym";
import type { WorkoutSession, ExerciseLog } from "../../../types/Gym";
import ExerciseLogger from "./ExerciseLogger";
import "./CurrentWorkout.css";

interface CurrentWorkoutProps {
  currentWorkout: WorkoutSession;
  onUpdateWorkout: (updatedWorkout: WorkoutSession) => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
}

const CurrentWorkout: React.FC<CurrentWorkoutProps> = ({
  currentWorkout,
  onUpdateWorkout,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const [newExerciseName, setNewExerciseName] = useState("");

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return; // Don't add empty name
    const newExerciseLog: ExerciseLog = {
      id: new Date().toISOString() + Math.random(), // Unique ID for the log
      exerciseName: newExerciseName.trim(),
      sets: [{ id: new Date().toISOString(), reps: 0, weight: 0 }], // Start with one empty set
    };
    onUpdateWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newExerciseLog],
    });
    setNewExerciseName(""); // Clear input
  };

  const handleUpdateExerciseLog = (updatedLog: ExerciseLog) => {
    const updatedExercises = currentWorkout.exercises.map((ex) =>
      ex.id === updatedLog.id ? updatedLog : ex
    );
    onUpdateWorkout({ ...currentWorkout, exercises: updatedExercises });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = currentWorkout.exercises.filter(
      (ex) => ex.id !== exerciseId
    );
    onUpdateWorkout({ ...currentWorkout, exercises: updatedExercises });
  };

  const handleWorkoutNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdateWorkout({ ...currentWorkout, workoutNotes: e.target.value });
  };

  return (
    <div className="current-workout-container">
      <h2>
        Workout Session - {new Date(currentWorkout.date).toLocaleDateString()}
      </h2>

      <div className="add-exercise-form">
        <input
          type="text"
          placeholder="Enter exercise name (e.g., Bench Press)"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
        />
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>

      {currentWorkout.exercises.length === 0 && (
        <p>No exercises added yet. Add one above!</p>
      )}

      {currentWorkout.exercises.map((exLog) => (
        <ExerciseLogger
          key={exLog.id}
          exerciseLog={exLog}
          onUpdateExerciseLog={handleUpdateExerciseLog}
          onDeleteExercise={handleDeleteExercise}
        />
      ))}

      <div className="workout-summary">
        <label htmlFor="workoutNotes">Overall Workout Notes:</label>
        <textarea
          id="workoutNotes"
          placeholder="General notes for this workout session..."
          value={currentWorkout.workoutNotes || ""}
          onChange={handleWorkoutNotesChange}
        />
        <div className="workout-actions">
          <button onClick={onFinishWorkout} className="finish-workout-btn">
            Finish & Save Workout
          </button>
          <button onClick={onCancelWorkout} className="cancel-workout-btn">
            Cancel Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentWorkout;
