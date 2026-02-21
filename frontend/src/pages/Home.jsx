import PollList from "../components/PollList";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="app-shell">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-float-in">
        <div className="mb-6 sm:mb-8 world-hero glass-surface surface-3d tilt-3d rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-blue-100 shadow-sm">
          <div className="hero-glow-orb hero-glow-orb--one" />
          <div className="hero-glow-orb hero-glow-orb--two" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-4 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-800 world-chip mb-3">
                🌍 Global Pulse
              </span>
              <h1 className="section-title hero-gradient-title text-3xl sm:text-4xl font-extrabold mb-2">
                Connect Voices Worldwide
              </h1>
              <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
                Discover what people think across communities, compare perspectives, and vote in live conversations happening around the world.
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="world-info-card bg-white/80 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-slate-600">Live Topics</p>
                  <p className="text-base font-bold text-slate-900">24/7</p>
                </div>
                <div className="world-info-card bg-white/80 border border-blue-100 rounded-xl p-3 [animation-delay:0.5s]">
                  <p className="text-xs text-slate-600">Community Reach</p>
                  <p className="text-base font-bold text-slate-900">Global</p>
                </div>
                <div className="world-info-card bg-white/80 border border-blue-100 rounded-xl p-3 col-span-2 sm:col-span-1 [animation-delay:1s]">
                  <p className="text-xs text-slate-600">Realtime Voting</p>
                  <p className="text-base font-bold text-slate-900">Instant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="relative">
                <div className="world-globe" />
                <div className="world-orbit" />
              </div>
            </div>
          </div>
        </div>
        <PollList />
      </main>
    </div>
  );
}