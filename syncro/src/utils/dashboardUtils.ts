// src/utils/dashboardUtils.ts
import type { Assignment } from "../types/Assignment";
import type { Habit } from "../types/habit";
import type { CalendarEvent } from "../types/event";
import type { WorkoutSession } from "../types/Gym"; // Assuming this is your logged workout type
import { getTodayString, isHabitDueToday } from "./dateUtils"; // We have these

const ASSIGNMENTS_STORAGE_KEY = "studentDash_assignments";
const HABITS_STORAGE_KEY = "studentDash_habits";
const SCHEDULE_EVENTS_STORAGE_KEY = "studentDash_scheduleEvents";
const GYM_SESSIONS_STORAGE_KEY = "studentDash_gymSessions"; // From GymPage

export const getAssignmentsForToday = (): Assignment[] => {
  const storedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
  if (!storedAssignments) return [];
  try {
    // <-- ADD TRY-CATCH

    const allAssignments: Assignment[] = JSON.parse(storedAssignments);
    const todayStr = getTodayString();

    return allAssignments
      .filter(
        (assign) =>
          !assign.completed &&
          (assign.dueDate === todayStr ||
            new Date(assign.dueDate) < new Date(todayStr))
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ); // Sort by due date
  } catch (error) {
    console.error("Error parsing assignments from localStorage:", error);
    return []; // Return empty array on error
  }
};

export const getDueHabitsForToday = (): Habit[] => {
  const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!storedHabits) return [];
  try {
    // <-- ADD TRY-CATCH
    const allHabits: Habit[] = JSON.parse(storedHabits);
    const todayStr = getTodayString();

    return allHabits
      .filter(
        (habit) =>
          isHabitDueToday(habit) && habit.lastCompletedDate !== todayStr
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  } catch (error) {
    console.error("Error parsing assignments from localStorage:", error);
    return []; // Return empty array on error
  }
};

export const getEventsForToday = (): CalendarEvent[] => {
  const storedEvents = localStorage.getItem(SCHEDULE_EVENTS_STORAGE_KEY);
  if (!storedEvents) return [];
  try {
    // <-- ADD TRY-CATCH
    // Remember to parse dates correctly
    const allEvents: CalendarEvent[] = JSON.parse(storedEvents).map(
      (event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      })
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // End of today

    return allEvents
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        // Check if event overlaps with today
        return eventStart <= endOfToday && eventEnd >= today;
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      ); // Sort by start time
  } catch (error) {
    console.error("Error parsing assignments from localStorage:", error);
    return []; // Return empty array on error
  }
};

export const getLastGymSession = (): WorkoutSession | null => {
  const storedSessions = localStorage.getItem(GYM_SESSIONS_STORAGE_KEY);
  if (!storedSessions) return null;
  try {
    const parsedSessions: any[] = JSON.parse(storedSessions); // Parse as any[] first

    const allSessions: WorkoutSession[] = parsedSessions.map((session: any) => {
      // Ensure session is an object and exercises is an array
      const exercises =
        session && Array.isArray(session.exercises) ? session.exercises : [];

      return {
        ...session, // Spread the original session properties
        id: session.id || `gym_session_${Math.random()}`, // Ensure ID
        date: session.date, // Assuming date is already a string like 'YYYY-MM-DD'
        exercises: exercises.map((ex: any) => {
          // Ensure ex is an object
          const currentExercise = ex || {};
          // Ensure actualSets is an array before mapping
          const actualSets =
            currentExercise && Array.isArray(currentExercise.actualSets)
              ? currentExercise.actualSets.map((set: any) => ({
                  ...(set || {}),
                }))
              : []; // Default to empty array if not an array or ex is null

          return {
            ...currentExercise, // Spread original exercise properties
            id: currentExercise.id || `gym_ex_${Math.random()}`, // Ensure ID
            actualSets: actualSets,
          };
        }),
      };
    });

    if (allSessions.length === 0) return null;

    // Sort by date to get the most recent session
    return allSessions.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Descending order
    })[0];
  } catch (error) {
    console.error("Error parsing gym sessions from localStorage:", error);
    return null;
  }
};