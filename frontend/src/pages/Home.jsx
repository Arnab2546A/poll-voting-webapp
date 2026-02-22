import PollList from "../components/PollList";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen world-hero relative overflow-hidden">
      <Navbar />

      {/* Decorative glow orbs */}
      <div className="hero-glow-orb hero-glow-orb--one"></div>
      <div className="hero-glow-orb hero-glow-orb--two"></div>

      {/* Earth Connection Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="absolute w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {/* Connection dots */}
          <circle cx="150" cy="100" r="3" fill="url(#dotGradient)" opacity="0.6" />
          <circle cx="1050" cy="200" r="3" fill="url(#dotGradient)" opacity="0.6" />
          <circle cx="300" cy="650" r="3" fill="url(#dotGradient)" opacity="0.6" />
          <circle cx="950" cy="700" r="3" fill="url(#dotGradient)" opacity="0.6" />
          
          {/* Connection lines with animation */}
          <line x1="150" y1="100" x2="1050" y2="200" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3" className="connection-line" />
          <line x1="150" y1="100" x2="300" y2="650" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3" className="connection-line" />
          <line x1="1050" y1="200" x2="950" y2="700" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3" className="connection-line" />
          
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#10b981" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14 animate-float-in">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl sm:text-4xl">🌍</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 uppercase tracking-widest">Global Community</span>
            </div>
            <h1 className="hero-gradient-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 leading-tight">
              Global Poll Feed
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 max-w-2xl leading-relaxed">
              Discover what millions think. Vote on topics that matter. Connect with perspectives from around the world.
            </p>
            
            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
              <div className="glass-surface rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center animate-float-in" style={{ animationDelay: "0.1s" }}>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Live Voting</p>
              </div>
              <div className="glass-surface rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center animate-float-in" style={{ animationDelay: "0.15s" }}>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-600">∞</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Global Reach</p>
              </div>
              <div className="glass-surface rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center animate-float-in" style={{ animationDelay: "0.2s" }}>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600">✓</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Your Voice</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8 animate-float-in" style={{ animationDelay: "0.25s" }}>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
            <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-600 to-teal-500 rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Active Polls</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Participate in conversations happening worldwide</p>
            </div>
          </div>
        </div>

        {/* Poll List */}
        <PollList />
      </main>
    </div>
  );
}