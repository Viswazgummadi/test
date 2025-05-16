// src/features/assignments/components/AssignmentItem.tsx
import React from "react";
import type { Assignment } from "../../../types/Assignment"; // Import the type
import "./AssignmentItem.css"; // We'll create this

interface AssignmentItemProps {
  assignment: Assignment;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <li
      className={`assignment-item ${assignment.completed ? "completed" : ""}`}
    >
      <div>
        <h3>
          {assignment.title} ({assignment.course})
        </h3>
        <p>
          Due: {assignment.dueDate} | Est. Time: {assignment.estimatedTimeHours}{" "}
          hrs
        </p>
      </div>
      <div>
        <button onClick={() => onToggleComplete(assignment.id)}>
          {assignment.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => onDelete(assignment.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </li>
  );
};

export default AssignmentItem;
