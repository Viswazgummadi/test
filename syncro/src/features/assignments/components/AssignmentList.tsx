// src/features/assignments/components/AssignmentList.tsx
import React from "react";
import type { Assignment } from "../../../types/Assignment";
import AssignmentItem from "./AssignmentItem";
import "./AssignmentList.css";

interface AssignmentListProps {
  assignments: Assignment[]; // This will now be the filtered list (active or archived)
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchivedView?: boolean;
  listTitle: string; // e.g., "Active Assignments" or "Archived Assignments"
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onToggleComplete,
  onDelete,
  onArchive,
  onRestore,
  isArchivedView,
  listTitle,
}) => {
  if (assignments.length === 0) {
    return <p>No {listTitle.toLowerCase()} found.</p>;
  }

  return (
    <div className="assignment-list-container">
      {/* <h3>{listTitle}</h3> */} {/* Title can be part of the page now */}
      <ul className="assignment-list">
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onRestore={onRestore}
            isArchivedView={isArchivedView}
          />
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
