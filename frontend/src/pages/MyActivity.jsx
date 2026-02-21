import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

export default function MyActivity() {
  const navigate = useNavigate();
  const [myPolls, setMyPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created"); // 'created' or 'voted'

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
      <div className="min-h-screen bg-gray-50">
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
            <p className="text-gray-700 text-base sm:text-lg font-medium">Loading activity...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Activity</h1>
          <p className="text-gray-700">Track your polls and votes</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("created")}
            className={`px-4 sm:px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === "created"
                ? "text-blue-600 border-blue-600"
                : "text-gray-700 border-transparent hover:text-gray-900"
            }`}
          >
            Polls Created ({myPolls.length})
          </button>
          <button
            onClick={() => setActiveTab("voted")}
            className={`px-4 sm:px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === "voted"
                ? "text-blue-600 border-blue-600"
                : "text-gray-700 border-transparent hover:text-gray-900"
            }`}
          >
            Polls Voted ({votedPolls.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "created" ? (
            myPolls.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <p className="text-gray-700 mb-4">You haven't created any polls yet.</p>
                <button
                  onClick={() => navigate("/create")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Create Your First Poll
                </button>
              </div>
            ) : (
              myPolls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-blue-200 cursor-pointer group"
                  onClick={() => navigate(`/poll/${poll.id}`)}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {poll.question}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created {formatDateTime(poll.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full whitespace-nowrap">
                      My Poll
                    </span>
                  </div>
                </div>
              ))
            )
          ) : votedPolls.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-700 mb-4">You haven't voted on any polls yet.</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Browse Polls
              </button>
            </div>
          ) : (
            votedPolls.map((poll) => (
              <div
                key={poll.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-blue-200 cursor-pointer group"
                onClick={() => navigate(`/poll/${poll.id}`)}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {poll.question}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created {formatDateTime(poll.created_at)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-300 px-3 py-1 rounded-full whitespace-nowrap">
                    ✓ Voted
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

