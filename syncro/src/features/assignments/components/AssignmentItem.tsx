// src/features/assignments/components/AssignmentItem.tsx
import React from "react";
import type { Assignment } from "../../../types/Assignment";
import "./AssignmentItem.css";

interface AssignmentItemProps {
  assignment: Assignment;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void; // New prop for archiving
  onRestore?: (id: string) => void; // New prop for restoring
  isArchivedView?: boolean; // To know which buttons to show
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  onToggleComplete,
  onDelete,
  onArchive,
  onRestore,
  isArchivedView = false,
}) => {
  return (
    <li
      className={`assignment-item ${assignment.completed ? "completed" : ""} ${
        assignment.archived ? "archived-look" : ""
      }`}
    >
      <div className="assignment-info">
        <h3>
          {assignment.title} ({assignment.course})
        </h3>
        <p>
          Due: {new Date(assignment.dueDate).toLocaleDateString()} | Est. Time:{" "}
          {assignment.estimatedTimeHours} hrs
          {assignment.completed && assignment.completedDate && (
            <span className="completed-date-text">
              {" "}
              | Completed:{" "}
              {new Date(assignment.completedDate).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
      <div className="assignment-actions">
        {!isArchivedView && (
          <>
            <button
              onClick={() => onToggleComplete(assignment.id)}
              className="toggle-complete-btn"
            >
              {assignment.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
            {assignment.completed &&
              onArchive &&
              !assignment.archived && ( // Show Archive only if completed and not archived
                <button
                  onClick={() => onArchive(assignment.id)}
                  className="archive-btn"
                >
                  Archive
                </button>
              )}
          </>
        )}
        {isArchivedView && onRestore && (
          <button
            onClick={() => onRestore(assignment.id)}
            className="restore-btn"
          >
            Restore
          </button>
        )}
        <button onClick={() => onDelete(assignment.id)} className="delete-btn">
          Delete {/* Delete works in both views */}
        </button>
      </div>
    </li>
  );
};

export default AssignmentItem;
