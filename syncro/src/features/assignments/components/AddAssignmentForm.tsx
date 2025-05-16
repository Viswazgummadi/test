// src/features/assignments/components/AddAssignmentForm.tsx
import React, { useState } from "react";
import type { Assignment } from "../../../types/Assignment";
import "./AddAssignmentForm.css";

interface AddAssignmentFormProps {
  onAddAssignment: (
    newAssignment: Omit<Assignment, "id" | "completed">
  ) => void;
}

const AddAssignmentForm: React.FC<AddAssignmentFormProps> = ({
  onAddAssignment,
}) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTimeHours, setEstimatedTimeHours] = useState<number | string>(
    ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !course || !dueDate || estimatedTimeHours === "") return;

    onAddAssignment({
      title,
      course,
      dueDate,
      estimatedTimeHours: Number(estimatedTimeHours),
    });

    // Reset form
    setTitle("");
    setCourse("");
    setDueDate("");
    setEstimatedTimeHours("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-assignment-form">
      <h3>Add New Assignment</h3>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="course">Course:</label>
        <input
          type="text"
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="estimatedTime">Estimated Time (hrs):</label>
        <input
          type="number"
          id="estimatedTime"
          value={estimatedTimeHours}
          onChange={(e) => setEstimatedTimeHours(e.target.value)}
          min="0.5"
          step="0.5"
          required
        />
      </div>
      <button type="submit">Add Assignment</button>
    </form>
  );
};

export default AddAssignmentForm;
