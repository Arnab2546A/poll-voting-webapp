import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen world-hero relative overflow-hidden flex items-center justify-center px-4 py-8">
      <div className="hero-glow-orb hero-glow-orb--one" />
      <div className="hero-glow-orb hero-glow-orb--two" />

      <div className="absolute inset-0 pointer-events-none opacity-35">
        <svg className="h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
          <circle cx="180" cy="160" r="3" fill="#3b82f6" opacity="0.7" />
          <circle cx="560" cy="120" r="2.5" fill="#14b8a6" opacity="0.65" />
          <circle cx="980" cy="220" r="3" fill="#10b981" opacity="0.7" />
          <circle cx="260" cy="700" r="2.5" fill="#0ea5e9" opacity="0.65" />
          <circle cx="860" cy="690" r="3" fill="#34d399" opacity="0.7" />
          <line x1="180" y1="160" x2="560" y2="120" stroke="#60a5fa" strokeWidth="1" opacity="0.32" className="connection-line" />
          <line x1="560" y1="120" x2="980" y2="220" stroke="#2dd4bf" strokeWidth="1" opacity="0.32" className="connection-line" />
          <line x1="180" y1="160" x2="260" y2="700" stroke="#38bdf8" strokeWidth="1" opacity="0.26" className="connection-line" />
          <line x1="260" y1="700" x2="860" y2="690" stroke="#10b981" strokeWidth="1" opacity="0.28" className="connection-line" />
          <line x1="980" y1="220" x2="860" y2="690" stroke="#22d3ee" strokeWidth="1" opacity="0.28" className="connection-line" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md animate-float-in">
        <div className="glass-surface surface-3d rounded-2xl sm:rounded-3xl border border-white/70 p-6 sm:p-8 shadow-xl">
          <div className="mb-7 text-center">
            <span className="world-chip mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-blue-800">
              🌍 Global Community Login
            </span>
            <h2 className="section-title hero-gradient-title text-3xl font-extrabold sm:text-4xl">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Join the worldwide conversation and cast your vote.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-white/90 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-teal-200 bg-white/90 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:via-sky-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 sm:text-base">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
