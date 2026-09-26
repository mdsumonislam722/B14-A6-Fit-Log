"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Flame,
  Star,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "../providers";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export default function MyPlan() {
  const {
    plan,
    saved,
    removeFromPlan,
    removeFromSaved,
    markDone,
  } = usePlan();

  const [activeTab, setActiveTab] = useState("plan");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkData() {
      try {
        await fetch(API_URL);
      } finally {
        setLoading(false);
      }
    }

    checkData();
  }, []);

  const currentItems = activeTab === "plan" ? plan : saved;

  const metrics = useMemo(() => {
    return plan.reduce(
      (total, item) => ({
        exercises: total.exercises + 1,
        minutes: total.minutes + Number(item.duration || 0),
        calories: total.calories + Number(item.caloriesBurned || 0),
      }),
      {
        exercises: 0,
        minutes: 0,
        calories: 0,
      }
    );
  }, [plan]);

  function handleDone(id) {
    markDone(id);
    toast.success("Workout marked as done");
  }

  function handleRemove(id) {
    if (activeTab === "plan") {
      removeFromPlan(id);
      toast("Workout removed from today's plan");
    } else {
      removeFromSaved(id);
      toast("Workout removed from saved");
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/10">
        <div className="container-fit flex min-h-[76px] items-center justify-between">
          <Link href="/" className="text-2xl font-black">
            FIT<span className="text-[#ccff00]">LOG</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-bold text-white/60 hover:text-white"
          >
            WORKOUT
          </Link>
        </div>
      </header>

      <section className="container-fit py-12">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-[#ccff00]"
        >
          <ArrowLeft size={16} />
          BACK TO WORKOUTS
        </Link>

        <p className="text-xs font-black tracking-[0.25em] text-[#ccff00]">
          DAILY LOG
        </p>

        <h1 className="display-font mt-2 text-6xl">MY PLAN</h1>

        <p className="mt-3 max-w-xl text-white/50">
          Cap of five lifts for today. Finish them, then load more.
        </p>

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          <Metric label="EXERCISES" value={metrics.exercises} />
          <Metric label="MINUTES" value={metrics.minutes} />
          <Metric label="CALORIES" value={metrics.calories} />
        </div>

        <div className="mt-10 flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-5 py-4 text-sm font-black ${
              activeTab === "plan"
                ? "border-b-2 border-[#ccff00] text-[#ccff00]"
                : "text-white/40"
            }`}
          >
            TODAY&apos;S PLAN ({plan.length})
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`px-5 py-4 text-sm font-black ${
              activeTab === "saved"
                ? "border-b-2 border-[#ccff00] text-[#ccff00]"
                : "text-white/40"
            }`}
          >
            SAVED ({saved.length})
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <p className="font-bold text-[#ccff00]">Loading workouts…</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="my-10 rounded-2xl border border-white/10 bg-[#111] px-6 py-20 text-center">
            <h2 className="display-font text-4xl">NOTHING HERE YET</h2>

            <p className="mx-auto mt-4 max-w-md text-white/45">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex bg-[#ccff00] px-6 py-4 text-sm font-black text-black"
            >
              GO TO WORKOUTS
            </Link>
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {currentItems.map((workout) => (
              <WorkoutRow
                key={workout.id}
                workout={workout}
                planTab={activeTab === "plan"}
                onDone={handleDone}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111] p-6">
      <p className="text-[10px] font-black tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-4xl font-black text-[#ccff00]">{value}</p>
    </div>
  );
}

function WorkoutRow({ workout, planTab, onDone, onRemove }) {
  return (
    <div
      className={`grid gap-5 rounded-xl border border-white/10 bg-[#111] p-4 sm:grid-cols-[130px_1fr_auto] sm:items-center ${
        workout.done ? "opacity-60" : ""
      }`}
    >
      <img
        src={workout.image}
        alt={workout.name}
        className="h-28 w-full rounded-lg object-cover sm:h-24"
      />

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black uppercase">{workout.name}</h3>

          {workout.done && (
            <span className="rounded-full bg-[#ccff00] px-2 py-1 text-[9px] font-black text-black">
              DONE
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-white/45">{workout.equipment}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {workout.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame size={14} />
            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star size={14} />
            {workout.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/workout/${workout.id}`}
          className="border border-white/15 px-4 py-3 text-xs font-black"
        >
          VIEW DETAILS
        </Link>

        {planTab && (
          <button
            onClick={() => onDone(workout.id)}
            disabled={workout.done}
            className="flex items-center gap-2 bg-[#ccff00] px-4 py-3 text-xs font-black text-black disabled:opacity-40"
          >
            <Check size={15} />
            MARK AS DONE
          </button>
        )}

        <button
          onClick={() => onRemove(workout.id)}
          className="grid h-11 w-11 place-items-center border border-red-500/30 text-red-400 hover:bg-red-500/10"
          aria-label="Remove"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}