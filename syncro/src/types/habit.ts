// src/types/habit.ts

export type HabitFrequency = "daily" | "weekly" | "specific_days"; // Add more as needed (e.g., 'monthly')

// For 'specific_days' frequency
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Habit {
  id: string;
  name: string;
  description?: string; // Optional, for more details
  frequency: HabitFrequency;
  specificDays?: DayOfWeek[]; // Only used if frequency is 'specific_days'
  lastCompletedDate?: string; // ISO string date (YYYY-MM-DD) of last completion
  // lastCompletedTimestamp?: number; // Alternative: Unix timestamp for more precise comparisons
  streak: number; // Current completion streak
  goal?: string; // e.g., "Drink 8 glasses of water", "Meditate for 10 minutes"
  createdAt: string; // ISO string date when the habit was created
}
