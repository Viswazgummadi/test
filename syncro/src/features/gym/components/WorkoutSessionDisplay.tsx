// src/features/gym/components/WorkoutSessionDisplay.tsx
import React from "react";
import type { WorkoutSession } from "../../../types/Gym";
import "./WorkoutSessionDisplay.css";

interface WorkoutSessionDisplayProps {
  session: WorkoutSession;
  onDeleteSession: (sessionId: string) => void;
}

const WorkoutSessionDisplay: React.FC<WorkoutSessionDisplayProps> = ({
  session,
  onDeleteSession,
}) => {
  return (
    <div className="workout-session-card">
      <div className="session-header">
        <h4>Workout: {new Date(session.date).toLocaleDateString()}</h4>
        <button
          onClick={() => onDeleteSession(session.id)}
          className="delete-session-btn"
        >
          Delete Session
        </button>
      </div>

      {session.workoutNotes && (
        <p className="workout-general-notes">
          <strong>Notes:</strong> {session.workoutNotes}
        </p>
      )}

      {session.exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-log-display">
          <h5>{exercise.exerciseName}</h5>
          <ul>
            {exercise.sets.map((set, index) => (
              <li key={set.id}>
                Set {index + 1}: {set.reps} reps @ {set.weight} kg/lb
              </li>
            ))}
          </ul>
          {exercise.notes && (
            <p className="exercise-specific-notes">
              <em>Note: {exercise.notes}</em>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutSessionDisplay;
