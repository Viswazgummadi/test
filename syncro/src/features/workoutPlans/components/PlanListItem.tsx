// src/features/workoutPlans/components/PlanListItem.tsx
import React from "react";
import type { WorkoutPlan } from "../../../types/gymPlan";
import "./PlanListItem.css";

interface PlanListItemProps {
  plan: WorkoutPlan;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PlanListItem: React.FC<PlanListItemProps> = ({
  plan,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="plan-list-item">
      <div className="plan-info">
        <h3>{plan.name}</h3>
        {plan.assignedDayOfWeek && (
          <span className="plan-list-day-badge">{plan.assignedDayOfWeek}</span>
        )}
        {plan.description && (
          <p className="plan-description">
            {plan.description.substring(0, 100)}
            {plan.description.length > 100 ? "..." : ""}
          </p>
        )}
        <p className="plan-exercise-count">
          {plan.exercises.length} exercise(s)
        </p>
      </div>
      <div className="plan-actions">
        <button onClick={onView} className="view-btn">
          View
        </button>
        <button onClick={onEdit} className="edit-btn">
          Edit
        </button>
        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlanListItem;
