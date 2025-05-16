// src/pages/WorkoutPlansPage.tsx
import React, { useState, useEffect } from "react";
import type { WorkoutPlan } from "../types/gymPlan";
import PlanBuilderForm from "../features/workoutPlans/components/PlanBuilderForm";
import PlanListItem from "../features/workoutPlans/components/PlanListItem";
import PlanDetailsDisplay from "../features/workoutPlans/components/PlanDetailsDisplay"; // Import new component
import "./WorkoutPlansPage.css";

const WORKOUT_PLANS_STORAGE_KEY = "studentDash_workoutPlans";

type ViewState = "list" | "form" | "details";

const WorkoutPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>(() => {
    // ... (localStorage loading)
    const storedPlans = localStorage.getItem(WORKOUT_PLANS_STORAGE_KEY);
    return storedPlans ? JSON.parse(storedPlans) : [];
  });

  const [currentView, setCurrentView] = useState<ViewState>("list");
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null); // For editing or viewing

  useEffect(() => {
    localStorage.setItem(WORKOUT_PLANS_STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const handleSavePlan = (planToSave: WorkoutPlan) => {
    if (selectedPlan && planToSave.id === selectedPlan.id) {
      // Check if it's an edit
      setPlans(plans.map((p) => (p.id === planToSave.id ? planToSave : p)));
    } else {
      // New plan, ensure ID is unique
      setPlans([
        ...plans,
        {
          ...planToSave,
          id:
            planToSave.id || new Date().toISOString() + "_plan" + Math.random(),
        },
      ]);
    }
    setSelectedPlan(null);
    setCurrentView("list");
  };

  const handleCreateNew = () => {
    setSelectedPlan(null); // No initial plan for the form
    setCurrentView("form");
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setCurrentView("form");
  };

  const handleViewPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setCurrentView("details");
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      setPlans(plans.filter((p) => p.id !== planId));
      if (selectedPlan?.id === planId) {
        // If deleting the currently viewed/edited plan
        setSelectedPlan(null);
        setCurrentView("list");
      }
    }
  };

  const handleCancelForm = () => {
    setSelectedPlan(null);
    setCurrentView("list");
  };

  const handleBackToListFromDetails = () => {
    setSelectedPlan(null);
    setCurrentView("list");
  };

  return (
    <div className="workout-plans-page">
      <h1>Workout Plans</h1>

      {currentView === "list" && (
        <>
          <button onClick={handleCreateNew} className="create-plan-btn">
            Create New Workout Plan
          </button>
          {plans.length === 0 && (
            <p>No workout plans created yet. Create one!</p>
          )}
          <div className="plans-list">
            {plans.map((plan) => (
              <PlanListItem
                key={plan.id}
                plan={plan}
                onView={() => handleViewPlan(plan)}
                onEdit={() => handleEditPlan(plan)}
                onDelete={() => handleDeletePlan(plan.id)}
              />
            ))}
          </div>
        </>
      )}

      {currentView === "form" && (
        <PlanBuilderForm
          initialPlan={selectedPlan} // Pass selectedPlan which could be null for new
          onSave={handleSavePlan}
          onCancel={handleCancelForm}
        />
      )}

      {currentView === "details" && selectedPlan && (
        <PlanDetailsDisplay
          plan={selectedPlan}
          onBackToList={handleBackToListFromDetails}
        />
      )}
    </div>
  );
};

export default WorkoutPlansPage;
