export default function Loading() {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080808] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#ccff00]" />
  
          <p className="mt-5 text-sm font-black tracking-[0.2em] text-[#ccff00]">
            LOADING WORKOUTS…
          </p>
        </div>
      </main>
    );
  }