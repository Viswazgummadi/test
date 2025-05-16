// src/utils/dateUtils.ts
import type { Habit, DayOfWeek as HabitDay } from "../types/habit";

// Map your DayOfWeek to Date.getDay() (Sunday is 0, Monday is 1, etc.)
const dayMap: Record<HabitDay, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};
const dayOfWeekArray: HabitDay[] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/**
 * Gets today's date as a YYYY-MM-DD string.
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Gets yesterday's date as a YYYY-MM-DD string.
 */
export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
  const day = yesterday.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a habit is due today based on its frequency.
 */
export const isHabitDueToday = (habit: Habit): boolean => {
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, ...

  switch (habit.frequency) {
    case "daily":
      return true;
    case "weekly":
      // For weekly, we can assume it's due if not completed this week.
      // A simple check: if lastCompletedDate is not within the last 7 days AND
      // it's the start of the week (e.g. Monday) or it was never completed.
      // This logic can be more complex depending on exact "weekly" definition.
      // For simplicity now, let's say it's always "due" until marked complete for the week.
      // A better way might be to reset `lastCompletedDate` at the start of each week.
      // For now, if last completed is not today, it's due if weekly.
      return habit.lastCompletedDate !== getTodayString();
    case "specific_days":
      if (!habit.specificDays || habit.specificDays.length === 0) return false;
      const currentDayName = dayOfWeekArray[currentDayIndex];
      return habit.specificDays.includes(currentDayName);
    default:
      return false;
  }
};
