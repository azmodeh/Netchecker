
'use client';

export default function Home() {
  return (
    <div className="relative h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your Next Great{' '}
            <span className="text-sky-400">Project</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Build modern and beautiful websites with this collection of stunning
            background patterns. Perfect for landing pages, apps, and dashboards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-lg bg-sky-400 px-6 py-3 font-medium text-slate-900 hover:bg-sky-300">
              Get Started
            </button>
            <button className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
