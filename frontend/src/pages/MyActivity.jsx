import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

export default function MyActivity() {
  const navigate = useNavigate();
  const [myPolls, setMyPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [totalVotesParticipated, setTotalVotesParticipated] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      setLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Note: ProtectedRoute ensures user is authenticated
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch polls created by user
      const { data: createdPolls, error: createdError } = await supabase
        .from("polls")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (!createdError) {
        setMyPolls(createdPolls || []);
      }

      // Fetch polls user has voted on
      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("poll_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!votesError && votes) {
        setTotalVotesParticipated(votes.length);
        // Get unique poll IDs
        const pollIds = [...new Set(votes.map((v) => v.poll_id))];

        if (pollIds.length > 0) {
          const { data: pollsData, error: pollsError } = await supabase
            .from("polls")
            .select("*")
            .in("id", pollIds);

          if (!pollsError) {
            setVotedPolls(pollsData || []);
          }
        }
      }

      setLoading(false);
    };

    void fetchUserActivity();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen world-hero">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-slate-700 text-base sm:text-lg font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen world-hero relative overflow-hidden">
      <Navbar />

      {/* Decorative glow orbs */}
      <div className="hero-glow-orb hero-glow-orb--one"></div>
      <div className="hero-glow-orb hero-glow-orb--two"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-14 animate-float-in">
          <h1 className="hero-gradient-title text-3xl sm:text-5xl font-bold mb-3">
            Your Global Activity
          </h1>
          <p className="text-slate-700 text-base sm:text-lg">
            Track your contribution to the worldwide voting community
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {/* Polls Created Card */}
          <div
            className="glass-surface surface-3d tilt-3d rounded-2xl p-6 sm:p-8 animate-float-in"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Polls Created
                </p>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mt-2">
                  {myPolls.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl">
                📊
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Contributions to global discourse
            </p>
          </div>

          {/* Votes Participated Card */}
          <div
            className="glass-surface surface-3d tilt-3d rounded-2xl p-6 sm:p-8 animate-float-in"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Votes Cast
                </p>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mt-2">
                  {totalVotesParticipated}
                </p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl">
                ✓
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Your voice in the community votes
            </p>
          </div>

        </div>

        {/* Your Polls Section */}
        <div className="mb-10 sm:mb-14 animate-float-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Your Polls</h2>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {myPolls.length}
            </span>
          </div>

          {myPolls.length === 0 ? (
            <div className="glass-surface surface-3d rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-slate-700 text-base sm:text-lg mb-6">
                You haven't created any polls yet.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="px-6 sm:px-8 py-3 sm:py-4 btn-3d bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Create Your First Poll
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {myPolls.map((poll, idx) => (
                <div
                  key={poll.id}
                  className="glass-surface surface-3d tilt-3d rounded-xl p-4 sm:p-6 cursor-pointer hover:border-blue-300 transition-all duration-300 animate-float-in"
                  onClick={() => navigate(`/poll/${poll.id}`)}
                  style={{ animationDelay: `${0.2 + idx * 0.03}s` }}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-950 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {poll.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Created {formatDateTime(poll.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Your Poll
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Votes Section */}
        <div className="animate-float-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-teal-400 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Your Votes</h2>
            <span className="text-sm font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
              {votedPolls.length}
            </span>
          </div>

          {votedPolls.length === 0 ? (
            <div className="glass-surface surface-3d rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-slate-700 text-base sm:text-lg mb-6">
                You haven't voted on any polls yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 sm:px-8 py-3 sm:py-4 btn-3d bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-300"
              >
                Browse Polls
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {votedPolls.map((poll, idx) => (
                <div
                  key={poll.id}
                  className="glass-surface surface-3d tilt-3d rounded-xl p-4 sm:p-6 cursor-pointer hover:border-teal-300 transition-all duration-300 animate-float-in"
                  onClick={() => navigate(`/poll/${poll.id}`)}
                  style={{ animationDelay: `${0.25 + idx * 0.03}s` }}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-950 group-hover:text-teal-600 transition-colors mb-2 line-clamp-2">
                        {poll.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Voted {formatDateTime(poll.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      Voted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

