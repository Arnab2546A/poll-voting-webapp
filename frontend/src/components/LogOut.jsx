import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function LogOut({
  withConfirm = true,
  className = "",
  text = "Logout",
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (withConfirm) {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (!confirmed) return;
    }

    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggingOut(false);
    navigate("/login");
  };

  if (loading) return null;

  return user ? (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`inline-flex items-center gap-2 px-4 py-2.5 btn-3d rounded-xl text-white font-semibold bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>{isLoggingOut ? "Logging out..." : text}</span>
    </button>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-5-9h10m0 0l-3-3m3 3l-3 3" />
      </svg>
      <span>Login</span>
    </button>
  );
}
