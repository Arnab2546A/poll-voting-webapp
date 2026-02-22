import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsAuthLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-surface sticky top-0 z-50 border-b border-blue-100/50 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-2xl">🌍</span>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent transition-all group-hover:scale-105">
              Global Poll Network
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-end gap-1 lg:gap-2">
            {isAuthLoading ? (
              <div className="h-10 w-64 rounded-lg bg-slate-200/70 animate-pulse" />
            ) : user ? (
              <>
                {/* Home Link */}
                <Link
                  to="/"
                  className="px-4 py-2 text-slate-700 text-sm lg:text-base font-medium rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                >
                  Home
                </Link>

                {/* Create Poll Button */}
                <Link
                  to="/create"
                  className="btn-3d px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm lg:text-base font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Create Poll
                </Link>

                {/* My Activity Link */}
                <Link
                  to="/my-activity"
                  className="px-4 py-2 text-slate-700 text-sm lg:text-base font-medium rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                >
                  My Activity
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 text-sm lg:text-base font-medium border border-slate-300 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-700 text-sm lg:text-base font-medium rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="btn-3d px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm lg:text-base font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-blue-50 transition-all"
            title="Toggle menu"
          >
            <svg
              className={`w-6 h-6 text-slate-700 transition-transform ${
                mobileMenuOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-2 bg-gradient-to-b from-blue-50/80 to-transparent rounded-lg mt-2 animate-float-in">
            {isAuthLoading ? (
              <div className="px-4 py-2.5 text-slate-600 font-medium">Loading...</div>
            ) : user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-slate-700 font-medium rounded-lg hover:bg-blue-100 transition-all"
                >
                  Home
                </Link>

                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Create Poll
                </Link>

                <Link
                  to="/my-activity"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-slate-700 font-medium rounded-lg hover:bg-emerald-100 transition-all"
                >
                  My Activity
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-slate-700 font-medium border border-slate-300 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-slate-700 font-medium rounded-lg hover:bg-blue-100 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
