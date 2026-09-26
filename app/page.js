"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  Bookmark,
  Clock3,
  Dumbbell,
  Flame,
  ListPlus,
  Star,
} from "lucide-react";
import { usePlan } from "./providers";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

function Navbar() {
  const { plan, saved } = usePlan();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur">
      <div className="container-fit flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tight">
          FIT<span className="text-[#ccff00]">LOG</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="border-b-2 border-[#ccff00] py-7 text-sm font-bold tracking-wider text-[#ccff00]"
          >
            WORKOUT
          </Link>

          <Link
            href="/my-plan"
            className="py-7 text-sm font-bold tracking-wider text-white/60 transition hover:text-white"
          >
            MY PLAN
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-plan"
            className="rounded-full bg-[#ccff00] px-3 py-2 text-xs font-black text-black sm:px-4"
          >
            PLAN <span>{plan.length}</span>
          </Link>

          <Link
            href="/my-plan"
            className="rounded-full border border-white/30 px-3 py-2 text-xs font-black sm:px-4"
          >
            SAVED <span>{saved.length}</span>
          </Link>
        </div>
      </div>

      <div className="container-fit flex gap-6 pb-3 md:hidden">
        <Link href="/" className="text-xs font-bold text-[#ccff00]">
          WORKOUT
        </Link>
        <Link href="/my-plan" className="text-xs font-bold text-white/60">
          MY PLAN
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="grid-pattern overflow-hidden border-b border-white/10">
      <div className="container-fit grid min-h-[570px] items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-5 text-xs font-black tracking-[0.3em] text-[#ccff00]">
            WORKOUT LIBRARY
          </p>

          <h1 className="display-font max-w-3xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            TRAIN WITH INTENT.
            <br />
            <span className="text-[#ccff00]">LOG EVERY SET.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/60">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <a
            href="#library"
            className="mt-8 inline-flex items-center gap-3 bg-[#ccff00] px-6 py-4 text-sm font-black text-black transition hover:translate-y-[-2px]"
          >
            BROWSE WORKOUTS
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <img
            src="https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691401.jpg?w=740"
            alt="FitLog workout"
            className="h-[390px] w-full object-cover opacity-85 lg:h-[470px]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6">
            <p className="text-xs font-bold tracking-[0.2em] text-[#ccff00]">
              FITLOG / 2026
            </p>
            <p className="mt-2 text-2xl font-black">TRAIN HARD. LOG HONEST.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkoutCard({ workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111] transition duration-200 hover:-translate-y-1 hover:border-[#ccff00]/50"
    >
      <div className="relative h-52 overflow-hidden bg-[#191919]">
        <img
          src={workout.image}
          alt={workout.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-full bg-black/80 px-2 py-1 text-[10px] font-black tracking-wider text-[#ccff00]"
            >
              {group.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-black uppercase tracking-tight">
          {workout.name}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
          <Dumbbell size={15} />
          {workout.equipment}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-xs text-white/60">
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
    </Link>
  );
}

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("duration");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch {
        setError("Could not load workouts. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      if (sort === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      return a.duration - b.duration;
    });
  }, [workouts, sort]);

  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      <Hero />

      <section id="library" className="container-fit py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-[#ccff00]">
              WORKOUTS / 12
            </p>

            <h2 className="display-font mt-2 text-5xl">
              THE LIBRARY
            </h2>

            <p className="mt-3 text-white/50">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          <div className="relative">
            <label className="mb-2 block text-[10px] font-black tracking-widest text-white/40">
              SORT BY
            </label>

            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#111] px-4 py-3">
              <ArrowDownUp size={16} className="text-[#ccff00]" />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none"
              >
                <option value="duration" className="bg-[#111]">
                  Duration
                </option>
                <option value="calories" className="bg-[#111]">
                  Calories
                </option>
                <option value="rating" className="bg-[#111]">
                  Rating
                </option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#ccff00]" />
              <p className="mt-5 text-sm font-bold text-white/50">
                Loading workouts…
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="container-fit flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 text-xl font-black">
          <span className="grid h-8 w-8 place-items-center rounded bg-[#ccff00] text-black">
            F
          </span>
          FITLOG
        </div>

        <p className="text-xs text-white/40">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}