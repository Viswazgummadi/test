// src/features/assignments/components/AssignmentList.tsx
import React from "react";
import type { Assignment } from "../../../types/Assignment"; // Import the type
import AssignmentItem from "./AssignmentItem";
import "./AssignmentList.css";

interface AssignmentListProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onToggleComplete,
  onDelete,
}) => {
  if (assignments.length === 0) {
    return <p>No assignments yet. Add some!</p>;
  }

  return (
    <ul className="assignment-list">
      {assignments.map((assignment) => (
        <AssignmentItem
          key={assignment.id}
          assignment={assignment}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default AssignmentList;
