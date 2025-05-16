// src/App.tsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import TodosPage from "./pages/TodosPage";
import SchedulePage from "./pages/SchedulePage"; // Create this file
import GymPage from "./pages/GymPage"; // Create this file
import AssignmentsPage from "./pages/AssignmentsPage"; // Create this file
import WorkoutPlansPage from './pages/WorkoutPlansPage'; // We'll create this
import HabitsPage from './pages/HabitsPage'; // Create this

import "./App.css"; // For app-wide styles if needed


// A layout component that includes the Navbar and renders child routes
const AppLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {" "}
        {/* Add some basic styling for main content area */}
        <Outlet />{" "}
        {/* This is where the matched child route component will render */}
      </main>
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {" "}
        {/* All routes under AppLayout will have Navbar */}
        <Route index element={<DashboardPage />} /> {/* Default page for "/" */}
        <Route path="todos" element={<TodosPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="gym" element={<GymPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="workout-plans" element={<WorkoutPlansPage />} />
        <Route path="habits" element={<HabitsPage />} />
        {/* Add more routes here as you build pages */}
        <Route
          path="*"
          element={
            <div>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />{" "}
        {/* Catch-all for unknown paths */}
      </Route>
    </Routes>
  );
}

export default App;
