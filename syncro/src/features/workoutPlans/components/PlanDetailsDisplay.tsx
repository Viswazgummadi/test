// src/features/workoutPlans/components/PlanDetailsDisplay.tsx
import React from "react";
import type {
  WorkoutPlan,
  PlannedExerciseData,
  PlannedSetData,
} from "../../../types/gymPlan";
import "./PlanDetailsDisplay.css"; // We'll create this CSS file

interface PlanDetailsDisplayProps {
  plan: WorkoutPlan;
  onBackToList: () => void; // Function to go back to the plans list
}

const ExerciseDetailCard: React.FC<{
  exercise: PlannedExerciseData;
  index: number;
}> = ({ exercise, index }) => {
  return (
    <div className="exercise-detail-card">
      <h3>
        {index + 1}. {exercise.exerciseName}
      </h3>
      {exercise.notes && (
        <p className="exercise-plan-notes">
          <strong>Notes:</strong> {exercise.notes}
        </p>
      )}
      {exercise.sets.length > 0 ? (
        <ul className="planned-sets-list">
          {exercise.sets.map((set: PlannedSetData) => (
            <li key={set.id}>
              Target:
              {set.targetReps !== undefined
                ? ` ${set.targetReps} reps`
                : " Reps N/A"}
              {set.targetWeight !== undefined
                ? ` @ ${set.targetWeight} kg/lb`
                : " Wt. N/A"}
              {set.notes && (
                <span className="set-detail-notes"> ({set.notes})</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No target sets defined for this exercise.</p>
      )}
    </div>
  );
};

const PlanDetailsDisplay: React.FC<PlanDetailsDisplayProps> = ({
  plan,
  onBackToList,
}) => {
  return (
    <div className="plan-details-display-container">
      <button onClick={onBackToList} className="back-to-list-btn">
        ← Back to Plans List
      </button>
      <h2>{plan.name}</h2>
      {plan.assignedDayOfWeek && (
        <p className="plan-assigned-day">
          <strong>Scheduled for:</strong> {plan.assignedDayOfWeek}
        </p>
      )}
      {plan.description && (
        <p className="plan-details-description">{plan.description}</p>
      )}

      <div className="exercises-scroll-container">
        {plan.exercises.length > 0 ? (
          plan.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise, index) => (
              <ExerciseDetailCard
                key={exercise.id}
                exercise={exercise}
                index={index}
              />
            ))
        ) : (
          <p>This plan currently has no exercises.</p>
        )}
      </div>
    </div>
  );
};

export default PlanDetailsDisplay;
