// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Assignment } from "../types/Assignment";
import type { Habit } from "../types/habit";
import type { CalendarEvent } from "../types/event";
import type { WorkoutSession } from "../types/Gym";
import {
  getAssignmentsForToday,
  getDueHabitsForToday,
  getEventsForToday,
  getLastGymSession,
} from "../utils/dashboardUtils"; // Import your new utils
import { getTodayString } from "../utils/dateUtils";
import "./DashboardPage.css"; // We'll create this

interface DashboardData {
  assignments: Assignment[];
  habits: Habit[];
  events: CalendarEvent[];
  lastGymSession: WorkoutSession | null;
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    assignments: [],
    habits: [],
    events: [],
    lastGymSession: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const loadData = () => {
      setDashboardData({
        assignments: getAssignmentsForToday(),
        habits: getDueHabitsForToday(),
        events: getEventsForToday(),
        lastGymSession: getLastGymSession(),
      });
      setIsLoading(false);
    };

    loadData();

    // Optional: Listen for storage changes to auto-update dashboard
    // This is a bit more advanced and might require a custom hook or context
    // For now, data loads on component mount. A refresh button could be simpler.
    const handleStorageChange = () => {
      // console.log("Storage changed, reloading dashboard data");
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Quick handlers - these would typically live in their respective page/context
  // For simplicity, we're just navigating. A real app might open a modal or have a global context.
  const quickMarkHabitDone = (habitId: string) => {
    // This is a simplified example. Proper state update should happen
    // in the Habits context/page and then this dashboard should re-fetch or be notified.
    // For now, just visually update and then the effect will re-fetch.
    const habits = JSON.parse(
      localStorage.getItem("studentDash_habits") || "[]"
    ) as Habit[];
    const todayStr = getTodayString();
    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        return {
          ...h,
          lastCompletedDate: todayStr,
          streak:
            h.lastCompletedDate === getTodayString() ? h.streak : h.streak + 1,
        }; // Simplified streak
      }
      return h;
    });
    localStorage.setItem("studentDash_habits", JSON.stringify(updatedHabits));
    setDashboardData((prev) => ({ ...prev, habits: getDueHabitsForToday() })); // Re-filter
    // alert(`Marked habit ${habitId} as done (simulated). Proper update needed via context/global state.`);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard!</h1>
        <p className="today-date">{todayDate}</p>
      </div>

      <div className="dashboard-grid">
        {/* Today's Assignments */}
        <section className="dashboard-section assignments-due">
          <h2>Assignments Due Soon / Overdue</h2>
          {dashboardData.assignments.length > 0 ? (
            <ul>
              {dashboardData.assignments.map((assign) => (
                <li
                  key={assign.id}
                  className={
                    new Date(assign.dueDate) < new Date(getTodayString())
                      ? "overdue"
                      : ""
                  }
                >
                  <Link to="/assignments">
                    <strong>{assign.title}</strong> ({assign.course})
                  </Link>
                  <span>
                    {" "}
                    - Due: {new Date(assign.dueDate).toLocaleDateString()}
                    {new Date(assign.dueDate) < new Date(getTodayString())
                      ? " (OVERDUE)"
                      : assign.dueDate === getTodayString()
                      ? " (Today!)"
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments due today or overdue. Great job!</p>
          )}
          <Link to="/assignments" className="view-all-link">
            View All Assignments →
          </Link>
        </section>

        {/* Habits for Today */}
        <section className="dashboard-section habits-today">
          <h2>Habits for Today</h2>
          {dashboardData.habits.length > 0 ? (
            <ul>
              {dashboardData.habits.map((habit) => (
                <li key={habit.id}>
                  <span>{habit.name}</span>
                  <button
                    onClick={() => quickMarkHabitDone(habit.id)}
                    className="quick-done-btn"
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>All habits due today are completed, or none scheduled!</p>
          )}
          <Link to="/habits" className="view-all-link">
            Manage Habits →
          </Link>
        </section>

        {/* Events Today */}
        <section className="dashboard-section events-today">
          <h2>Today's Schedule</h2>
          {dashboardData.events.length > 0 ? (
            <ul>
              {dashboardData.events.map((event) => (
                <li
                  key={event.id}
                  style={{ borderLeftColor: event.color || "#3174ad" }}
                >
                  <Link to="/schedule">
                    <strong>{event.title}</strong>
                  </Link>
                  <span>
                    {" "}
                    -{" "}
                    {new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(event.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events scheduled for today.</p>
          )}
          <Link to="/schedule" className="view-all-link">
            View Full Schedule →
          </Link>
        </section>

        {/* Last Gym Session (Optional) */}
        {dashboardData.lastGymSession && (
          <section className="dashboard-section last-gym">
            <h2>Last Gym Session</h2>
            <p>
              You last hit the gym on:{" "}
              {new Date(dashboardData.lastGymSession.date).toLocaleDateString()}
              .
              <br />
              Logged {dashboardData.lastGymSession.exercises.length} exercises.
            </p>
            <Link to="/gym" className="view-all-link">
              View Gym Logs →
            </Link>
          </section>
        )}
      </div>

      {/* Quick Add Buttons (Example) */}
      <div className="quick-add-section">
        <h3>Quick Add:</h3>
        {/* These would ideally open modals from the respective sections */}
        <Link to="/assignments#add" className="quick-add-btn">
          New Assignment
        </Link>
        <Link to="/schedule#add" className="quick-add-btn">
          New Event
        </Link>
        <Link to="/habits#add" className="quick-add-btn">
          New Habit
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
