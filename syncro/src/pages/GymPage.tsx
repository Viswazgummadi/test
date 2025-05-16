// src/pages/GymPage.tsx
import React, { useState, useEffect } from "react";
import type { WorkoutSession } from "../types/Gym";
import CurrentWorkout from "../features/gym/components/CurrentWorkout";
import WorkoutSessionDisplay from "../features/gym/components/WorkoutSessionDisplay";
import "./GymPage.css"; // We'll create this for page-specific layout

const GYM_SESSIONS_STORAGE_KEY = "studentDash_gymSessions";

const GymPage: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(
    null
  );
  const [pastWorkouts, setPastWorkouts] = useState<WorkoutSession[]>(() => {
    const storedSessions = localStorage.getItem(GYM_SESSIONS_STORAGE_KEY);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      GYM_SESSIONS_STORAGE_KEY,
      JSON.stringify(pastWorkouts)
    );
  }, [pastWorkouts]);

  const handleStartNewWorkout = () => {
    setCurrentWorkout({
      id: new Date().toISOString() + "_workout", // Unique ID for workout
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD
      exercises: [],
      workoutNotes: "",
    });
  };

  const handleUpdateCurrentWorkout = (updatedWorkout: WorkoutSession) => {
    setCurrentWorkout(updatedWorkout);
  };

  const handleFinishWorkout = () => {
    if (currentWorkout && currentWorkout.exercises.length > 0) {
      // Only save if there are exercises
      // Filter out exercises with no sets or sets with no reps/weight
      const cleanedWorkout: WorkoutSession = {
        ...currentWorkout,
        exercises: currentWorkout.exercises
          .map((ex) => ({
            ...ex,
            sets: ex.sets.filter((set) => set.reps > 0 || set.weight > 0), // Ensure set has some data
          }))
          .filter((ex) => ex.sets.length > 0), // Ensure exercise has valid sets
      };

      if (cleanedWorkout.exercises.length > 0) {
        setPastWorkouts((prev) => [cleanedWorkout, ...prev]); // Add to beginning of history
      }
    }
    setCurrentWorkout(null); // Clear current workout
  };

  const handleCancelWorkout = () => {
    // Optionally, ask for confirmation
    setCurrentWorkout(null);
  };

  const handleDeletePastSession = (sessionId: string) => {
    setPastWorkouts((prev) =>
      prev.filter((session) => session.id !== sessionId)
    );
  };

  return (
    <div className="gym-page-container">
      <h1>Gym Tracker</h1>

      {!currentWorkout ? (
        <button onClick={handleStartNewWorkout} className="start-workout-btn">
          Start New Workout Session
        </button>
      ) : (
        <CurrentWorkout
          currentWorkout={currentWorkout}
          onUpdateWorkout={handleUpdateCurrentWorkout}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
        />
      )}

      <div className="workout-history">
        <h2>Workout History</h2>
        {pastWorkouts.length === 0 && !currentWorkout && (
          <p>No past workouts recorded yet. Start a new session!</p>
        )}
        {pastWorkouts.map((session) => (
          <WorkoutSessionDisplay
            key={session.id}
            session={session}
            onDeleteSession={handleDeletePastSession}
          />
        ))}
      </div>
    </div>
  );
};

export default GymPage;
