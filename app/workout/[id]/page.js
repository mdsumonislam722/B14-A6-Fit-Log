"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Check,
  ListPlus,
  Clock3,
  Flame,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { usePlan } from "../../providers";

export default function WorkoutDetails() {
  const { id } = useParams();
  const { addToPlan, saveWorkout, plan, saved } = usePlan();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fitlog-workouts");

      if (stored) {
        const workouts = JSON.parse(stored);

        const found = workouts.find(
          (item) => String(item.id) === String(id)
        );

        if (found) {
          setWorkout(found);
          setLoading(false);
          return;
        }
      }

      setWorkout(null);
    } catch {
      setWorkout(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080808] text-white">
        <p className="font-bold text-[#ccff00]">Loading workout…</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080808] px-6 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black">WORKOUT NOT FOUND</h1>

          <Link
            href="/"
            className="mt-6 inline-block bg-[#ccff00] px-6 py-3 font-black text-black"
          >
            BACK TO LIBRARY
          </Link>
        </div>
      </main>
    );
  }

  const alreadyPlanned = plan.some(
    (item) => String(item.id) === String(workout.id)
  );

  const alreadySaved = saved.some(
    (item) => String(item.id) === String(workout.id)
  );

  function handlePlan() {
    const result = addToPlan(workout);

    if (result.success) {
      toast.success("Added to today's plan");
    } else {
      toast.error(result.message);
    }
  }

  function handleSave() {
    const result = saveWorkout(workout);

    if (result.success) {
      toast.success("Saved for later");
    } else {
      toast.error(result.message);
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
            href="/my-plan"
            className="text-sm font-bold text-white/60 hover:text-white"
          >
            MY PLAN
          </Link>
        </div>
      </header>

      <section className="container-fit py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-[#ccff00]"
        >
          <ArrowLeft size={16} />
          BACK TO LIBRARY
        </Link>

        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111] lg:grid-cols-2">
          <div className="min-h-[420px] bg-black">
            <img
              src={workout.image}
              alt={workout.name}
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex flex-wrap gap-2">
              {workout.muscleGroups?.map((group) => (
                <span
                  key={group}
                  className="rounded-full bg-[#ccff00] px-3 py-1 text-xs font-black text-black"
                >
                  {group}
                </span>
              ))}
            </div>

            <h1 className="display-font mt-6 text-5xl uppercase leading-none sm:text-6xl">
              {workout.name}
            </h1>

            <p className="mt-6 leading-7 text-white/55">
              {workout.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
              <Spec label="EQUIPMENT" value={workout.equipment} />
              <Spec label="DIFFICULTY" value={workout.difficulty} />
              <Spec label="SETS" value={workout.sets} />
              <Spec label="REPS" value={workout.reps} />
              <Spec label="DURATION" value={`${workout.duration} min`} />
              <Spec
                label="CALORIES"
                value={`${workout.caloriesBurned} kcal`}
              />
              <Spec label="RATING" value={workout.rating} />
            </div>

            <div className="mt-8">
              <h2 className="text-xs font-black tracking-[0.2em] text-[#ccff00]">
                INSTRUCTIONS
              </h2>

              <ol className="mt-4 space-y-4">
                {workout.instructions?.map((instruction, index) => (
                  <li
                    key={`${instruction}-${index}`}
                    className="flex gap-4 text-sm leading-6 text-white/65"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#ccff00] text-xs font-black text-[#ccff00]">
                      {index + 1}
                    </span>

                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handlePlan}
                disabled={alreadyPlanned}
                className="flex flex-1 items-center justify-center gap-2 bg-[#ccff00] px-5 py-4 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {alreadyPlanned ? (
                  <Check size={18} />
                ) : (
                  <ListPlus size={18} />
                )}

                {alreadyPlanned
                  ? "IN TODAY'S PLAN"
                  : "ADD TO TODAY'S PLAN"}
              </button>

              <button
                onClick={handleSave}
                disabled={alreadySaved}
                className="flex flex-1 items-center justify-center gap-2 border border-white/20 px-5 py-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Bookmark size={18} />

                {alreadySaved ? "SAVED" : "SAVE FOR LATER"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Spec({ label, value }) {
  return (
    <div className="bg-[#111] p-4">
      <p className="text-[9px] font-black tracking-widest text-white/35">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}