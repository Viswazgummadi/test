// src/types/assignment.ts
export interface Assignment {
  id: string; // Unique identifier
  title: string;
  course: string;
  dueDate: string; // Or Date object, string is simpler for now
  estimatedTimeHours: number;
  completed: boolean;
  archived?: boolean; // <-- ADD THIS LINE (optional for existing data)
  completedDate?: string; // Optional: Store when it was completed
}
