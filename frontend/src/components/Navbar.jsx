import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="glass-surface surface-3d sticky top-0 z-50 border-b border-white/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-auto min-h-16 flex-wrap items-center justify-between gap-3 py-3 sm:py-2">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent transition-all"
          >
            VotingPoll
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {user ? (
              <>
                {/* Create Poll Button */}
                <Link
                  to="/create"
                  className="btn-3d px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200"
                >
                  Create Poll
                </Link>

                {/* My Activity Link */}
                <Link
                  to="/my-activity"
                  className="px-3 sm:px-4 py-2 text-gray-800 text-sm sm:text-base font-medium rounded-lg hover:bg-white/80 transition-all duration-200"
                >
                  My Activity
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-gray-800 text-sm sm:text-base font-medium border border-gray-300 rounded-lg hover:bg-white transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-gray-800 text-sm sm:text-base font-medium rounded-lg hover:bg-white/80 transition-all duration-200"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="btn-3d px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
