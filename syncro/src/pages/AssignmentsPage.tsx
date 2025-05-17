// src/pages/AssignmentsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import type { Assignment } from "../types/Assignment";
import AddAssignmentForm from "../features/assignments/components/AddAssignmentForm";
import AssignmentList from "../features/assignments/components/AssignmentList";
import Modal from "../components/common/Modal";
import { getTodayString } from "../utils/dateUtils"; // Import if not already
import "./AssignmentsPage.css";

const ASSIGNMENTS_STORAGE_KEY = "studentDash_assignments";

type ViewMode = "active" | "archived";

const AssignmentsPage: React.FC = () => {
  const [allAssignments, setAllAssignments] = useState<Assignment[]>(() => {
    const storedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    return storedAssignments ? JSON.parse(storedAssignments) : [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("active"); // New state for view mode

  useEffect(() => {
    localStorage.setItem(
      ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(allAssignments)
    );
  }, [allAssignments]);

  const handleAddAssignment = (
    newAssignmentData: Omit<
      Assignment,
      "id" | "completed" | "archived" | "completedDate"
    >
  ) => {
    const newAssignment: Assignment = {
      ...newAssignmentData,
      id: new Date().toISOString() + "_assignment" + Math.random(),
      completed: false,
      archived: false, // Initialize as not archived
    };
    setAllAssignments((prev) =>
      [newAssignment, ...prev].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    );
    setIsAddModalOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    setAllAssignments((prev) =>
      prev.map((asm) => {
        if (asm.id === id) {
          const isNowCompleted = !asm.completed;
          return {
            ...asm,
            completed: isNowCompleted,
            completedDate: isNowCompleted ? getTodayString() : undefined,
            // Don't archive automatically, let user do it
          };
        }
        return asm;
      })
    );
  };

  const handleArchiveAssignment = (id: string) => {
    setAllAssignments((prev) =>
      prev.map((asm) => (asm.id === id ? { ...asm, archived: true } : asm))
    );
  };

  const handleRestoreAssignment = (id: string) => {
    setAllAssignments((prev) =>
      prev.map(
        (asm) =>
          asm.id === id ? { ...asm, archived: false, completed: true } : asm // Assume restored items are still complete
      )
    );
  };

  const handleDeleteAssignment = (id: string) => {
    // Confirm deletion, especially for archived items
    if (
      window.confirm(
        "Are you sure you want to permanently delete this assignment?"
      )
    ) {
      setAllAssignments((prev) => prev.filter((asm) => asm.id !== id));
    }
  };

  // Memoize filtered lists to avoid re-calculating on every render
  const activeAssignments = useMemo(() => {
    return allAssignments
      .filter((asm) => !asm.archived)
      .sort((a, b) => {
        // Sort by completion status (incomplete first), then by due date
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [allAssignments]);

  const archivedAssignments = useMemo(() => {
    return allAssignments
      .filter((asm) => asm.archived === true) // Explicitly check for true
      .sort(
        (
          a,
          b // Sort by completedDate descending (newest archived first)
        ) =>
          new Date(b.completedDate || 0).getTime() -
          new Date(a.completedDate || 0).getTime()
      );
  }, [allAssignments]);

  return (
    <div className="assignments-page-container">
      <div className="assignments-header">
        <h1>Assignments</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="add-assignment-fab"
        >
          +
        </button>
      </div>

      <div className="view-mode-toggle">
        <button
          onClick={() => setViewMode("active")}
          className={viewMode === "active" ? "active" : ""}
        >
          Active ({activeAssignments.filter((a) => !a.completed).length}{" "}
          pending)
        </button>
        <button
          onClick={() => setViewMode("archived")}
          className={viewMode === "archived" ? "active" : ""}
        >
          Archived ({archivedAssignments.length})
        </button>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Assignment"
      >
        <AddAssignmentForm onAddAssignment={handleAddAssignment} />
      </Modal>

      {viewMode === "active" && (
        <AssignmentList
          listTitle="Active Assignments"
          assignments={activeAssignments}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteAssignment}
          onArchive={handleArchiveAssignment}
          isArchivedView={false}
        />
      )}

      {viewMode === "archived" && (
        <AssignmentList
          listTitle="Archived Assignments"
          assignments={archivedAssignments}
          onToggleComplete={handleToggleComplete} // Still allow toggling if needed (e.g., mistake)
          onDelete={handleDeleteAssignment}
          onRestore={handleRestoreAssignment}
          isArchivedView={true}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;
