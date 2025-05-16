// src/pages/HabitsPage.tsx
import React, { useState, useEffect } from "react";
import type { Habit } from "../types/habit";
import HabitItem from "../features/habits/components/HabitItem";
import AddHabitForm from "../features/habits/components/AddHabitForm";
import Modal from "../components/common/Modal";
import {
  getTodayString,
  getYesterdayString,
  isHabitDueToday,
} from "../utils/dateUtils";
import "./HabitsPage.css";

const HABITS_STORAGE_KEY = "studentDash_habits";

const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    return storedHabits ? JSON.parse(storedHabits) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const handleOpenModal = (habitToEdit?: Habit) => {
    setEditingHabit(habitToEdit || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingHabit(null);
    setIsModalOpen(false);
  };

  const handleSaveHabit = (
    habitData:
      | Omit<Habit, "id" | "lastCompletedDate" | "streak" | "createdAt">
      | Habit
  ) => {
    if ("id" in habitData && habitData.id) {
      // Editing existing habit
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h.id === habitData.id ? { ...h, ...habitData } : h
        )
      );
    } else {
      // Adding new habit
      const newHabit: Habit = {
        ...habitData,
        id: new Date().toISOString() + "_habit" + Math.random(),
        lastCompletedDate: undefined,
        streak: 0,
        createdAt: new Date().toISOString(),
      };
      setHabits((prevHabits) => [...prevHabits, newHabit]);
    }
    handleCloseModal();
  };

  const handleToggleComplete = (id: string) => {
    const todayStr = getTodayString();
    const yesterdayStr = getYesterdayString();

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const isCompletedToday = habit.lastCompletedDate === todayStr;
          if (isCompletedToday) {
            // Un-completing
            // If un-completing, streak might need to revert based on yesterday's status
            // This simplified version just decrements or resets to 0.
            // More complex logic could check if it was completed yesterday.
            return {
              ...habit,
              lastCompletedDate: undefined,
              streak: Math.max(0, habit.streak - 1),
            };
          } else {
            // Completing for today
            let newStreak = habit.streak;
            if (habit.lastCompletedDate === yesterdayStr) {
              newStreak += 1; // Increment streak if completed yesterday
            } else if (
              habit.lastCompletedDate &&
              habit.lastCompletedDate !== todayStr
            ) {
              newStreak = 1; // Reset streak if last completion was not yesterday
            } else {
              // Never completed or uncompleted today
              newStreak = 1;
            }
            return { ...habit, lastCompletedDate: todayStr, streak: newStreak };
          }
        }
        return habit;
      })
    );
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      setHabits((prevHabits) => prevHabits.filter((h) => h.id !== id));
    }
  };

  // Sort habits: due today first, then by creation date or name
  const sortedHabits = [...habits].sort((a, b) => {
    const aDue = isHabitDueToday(a) && a.lastCompletedDate !== getTodayString();
    const bDue = isHabitDueToday(b) && b.lastCompletedDate !== getTodayString();

    if (aDue && !bDue) return -1; // a comes first
    if (!aDue && bDue) return 1; // b comes first

    // If both due or both not due, sort by creation or name
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    // return a.name.localeCompare(b.name);
  });

  return (
    <div className="habits-page-container">
      <div className="habits-header">
        <h1>Habit Tracker</h1>
        <button onClick={() => handleOpenModal()} className="add-habit-fab">
          +
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingHabit ? "Edit Habit" : "Add New Habit"}
      >
        <AddHabitForm
          onSaveHabit={handleSaveHabit}
          onCancel={handleCloseModal}
          existingHabit={editingHabit}
        />
      </Modal>

      {sortedHabits.length === 0 && (
        <p className="no-habits-message">
          No habits yet. Click the '+' to add your first one!
        </p>
      )}
      <ul className="habits-list">
        {sortedHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggleComplete={handleToggleComplete}
            onEdit={() => handleOpenModal(habit)}
            onDelete={handleDeleteHabit}
          />
        ))}
      </ul>
    </div>
  );
};

export default HabitsPage;
