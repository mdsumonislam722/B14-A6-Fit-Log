"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";

const PlanContext = createContext(null);

export function Providers({ children }) {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = JSON.parse(localStorage.getItem("fitlog-plan") || "[]");
      const storedSaved = JSON.parse(localStorage.getItem("fitlog-saved") || "[]");

      setPlan(storedPlan);
      setSaved(storedSaved);
    } catch {
      setPlan([]);
      setSaved([]);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("fitlog-plan", JSON.stringify(plan));
    }
  }, [plan, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("fitlog-saved", JSON.stringify(saved));
    }
  }, [saved, hydrated]);

  function addToPlan(workout) {
    if (plan.some((item) => item.id === workout.id)) {
      return { success: false, message: "Already in today's plan" };
    }

    if (plan.length >= 5) {
      return { success: false, message: "Today's plan is full (5 lifts max)" };
    }

    setPlan((current) => [...current, { ...workout, done: false }]);

    return { success: true, message: "Added to today's plan" };
  }

  function saveWorkout(workout) {
    if (saved.some((item) => item.id === workout.id)) {
      return { success: false, message: "Already saved" };
    }

    setSaved((current) => [...current, workout]);

    return { success: true, message: "Saved for later" };
  }

  function removeFromPlan(id) {
    setPlan((current) => current.filter((item) => item.id !== id));
  }

  function removeFromSaved(id) {
    setSaved((current) => current.filter((item) => item.id !== id));
  }

  function markDone(id) {
    setPlan((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: true } : item
      )
    );
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        addToPlan,
        saveWorkout,
        removeFromPlan,
        removeFromSaved,
        markDone,
      }}
    >
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
      />
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error("usePlan must be used inside Providers");
  }

  return context;
}