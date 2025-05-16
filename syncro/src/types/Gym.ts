// src/types/gym.ts

// Represents a single set of an exercise
export interface GymSet {
  id: string; // Unique ID for the set (e.g., uuidv4() or timestamp)
  reps: number;
  weight: number;
}

// Represents an exercise logged during a workout session
export interface ExerciseLog {
  id: string; // Unique ID for this logged exercise instance
  exerciseName: string; // e.g., "Bench Press", "Squats"
  sets: GymSet[];
  notes?: string; // Optional notes for this specific exercise during this session
}

// Represents a complete workout session
export interface WorkoutSession {
  id: string; // Unique ID for the workout session
  date: string; // ISO string date (e.g., "2023-10-27")
  exercises: ExerciseLog[];
  workoutNotes?: string; // Optional general notes for the entire workout
}
