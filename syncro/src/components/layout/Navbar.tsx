// src/components/layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // We'll create this CSS file next

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        StudentDash
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/schedule">Schedule</Link>
        </li>
        <li>
          <Link to="/gym">Gym</Link>
        </li>
        <li>
          <Link to="/assignments">Assignments</Link>
        </li>
        <li>
          <Link to="/workout-plans">Workout Plans</Link>
        </li>
        <li>
          <Link to="/habits">Habits</Link>
        </li>
        {/* Add more links as you create pages */}
      </ul>
    </nav>
  );
};

export default Navbar;
