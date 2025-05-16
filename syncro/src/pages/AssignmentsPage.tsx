// src/pages/AssignmentsPage.tsx
import React, { useState, useEffect } from "react";
import type { Assignment } from "../types/Assignment";
import AddAssignmentForm from "../features/assignments/components/AddAssignmentForm";
import AssignmentList from "../features/assignments/components/AssignmentList";
import Modal from "../components/common/Modal"; // Import the Modal component
import "./AssignmentsPage.css"; // We'll create this for the "+" button styling

const ASSIGNMENTS_STORAGE_KEY = "studentDash_assignments";

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const storedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    return storedAssignments ? JSON.parse(storedAssignments) : [];
  });

  // ---- NEW STATE for Modal Visibility ----
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  const handleAddAssignment = (
    newAssignmentData: Omit<Assignment, "id" | "completed">
  ) => {
    const newAssignment: Assignment = {
      ...newAssignmentData,
      id: new Date().toISOString() + "_assignment" + Math.random(), // Simple unique ID
      completed: false,
    };
    setAssignments((prev) =>
      [newAssignment, ...prev].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    ); // Sort by due date
    setIsAddModalOpen(false); // ---- CLOSE MODAL on successful add ----
  };

  const handleToggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((asm) =>
        asm.id === id ? { ...asm, completed: !asm.completed } : asm
      )
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((asm) => asm.id !== id));
  };

  return (
    <div className="assignments-page-container">
      {" "}
      {/* Add a container for better styling */}
      <div className="assignments-header">
        <h1>Assignments</h1>
        {/* ---- BUTTON TO OPEN MODAL ---- */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="add-assignment-fab"
        >
          +
        </button>
      </div>
      {/* ---- MODAL for AddAssignmentForm ---- */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Assignment"
      >
        <AddAssignmentForm
          onAddAssignment={handleAddAssignment}
          // Optionally pass a cancel handler if AddAssignmentForm needs one
          // onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      {assignments.length === 0 && (
        <p className="no-assignments-message">
          No assignments yet. Click the '+' button to add one!
        </p>
      )}
      <AssignmentList
        assignments={assignments}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteAssignment}
      />
    </div>
  );
};

export default AssignmentsPage;
