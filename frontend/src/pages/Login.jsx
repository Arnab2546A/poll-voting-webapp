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
    <div className="app-shell min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-float-in">
        <div className="glass-surface surface-3d tilt-3d rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/70 shadow-xl">
          <div className="text-center mb-7">
            <h2 className="section-title text-3xl font-extrabold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-600 text-sm sm:text-base">Login to continue voting and creating polls</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6 text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
