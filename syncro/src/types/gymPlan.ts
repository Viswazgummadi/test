// src/types/gymPlan.ts
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: PlannedExerciseData[];
  assignedDayOfWeek?: DayOfWeek | null; // Or DayOfWeek if always required
}
// Represents a single SET of an exercise (ACTUAL performance)
export interface LoggedSet {
  // Was GymSet
  id: string;
  actualReps: number;
  actualWeight: number;
  // Target values, populated if this set was part of a plan
  targetReps?: number;
  targetWeight?: number;
  plannedSetNotes?: string; // Notes from the plan for this set
  performanceNotes?: string; // Notes specific to how this set felt when performed
}

// Represents an EXERCISE logged during a workout session
export interface LoggedExercise {
  // Was ExerciseLog
  id: string; // Unique ID for this instance of logging
  exerciseName: string;
  plannedExerciseId?: string; // Link to PlannedExerciseData.id if based on a plan
  order?: number; // Original planned order, if applicable
  status:
    | "pending"
    | "completed"
    | "skipped"
    | "partially_completed"
    | "ad_hoc"; // 'pending' for planned, 'ad_hoc' for freestyle
  targetSetsDefinition?: string; // e.g., "3 sets of 8-12 reps" (from plan, for quick display)
  actualSets: LoggedSet[];
  exerciseNotes?: string; // Notes for this specific exercise during this session
}

// Represents a complete WORKOUT SESSION
export interface WorkoutSession {
  id: string;
  date: string;
  planId?: string; // ID of the WorkoutPlan used, if any
  planName?: string; // Name of the WorkoutPlan used, for display convenience
  exercises: LoggedExercise[];
  workoutNotes?: string;
}

export interface PlannedSetData {
  id: string; // Unique ID for this planned set
  targetReps?: number;
  targetWeight?: number;
  notes?: string; // e.g., "Focus on form", "AMRAP" (As Many Reps As Possible)
}

export interface PlannedExerciseData {
  id: string; // Unique ID for this exercise within the plan
  exerciseName: string;
  order: number; // To maintain the sequence of exercises in the plan
  sets: PlannedSetData[];
  notes?: string; // General notes for this exercise in the plan
}

export interface WorkoutPlan {
  id: string; // Unique ID for the entire workout plan
  name: string; // e.g., "Leg Day - Week 1", "Push Day A"
  description?: string;
  exercises: PlannedExerciseData[]; // Ordered list of exercises
}
