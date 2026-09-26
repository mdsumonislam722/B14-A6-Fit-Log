import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080808] px-6 text-white">
      <div className="text-center">
        <p className="text-sm font-black tracking-[0.3em] text-[#ccff00]">
          FITLOG / 404
        </p>

        <h1 className="display-font mt-4 text-7xl">PAGE NOT FOUND</h1>

        <p className="mt-5 text-white/50">
        The workout or page you are looking for does not exist. Return to the library and keep training.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block bg-[#ccff00] px-7 py-4 text-sm font-black text-black"
        >
          BACK TO WORKOUTS
        </Link>
      </div>
    </main>
  );
}
