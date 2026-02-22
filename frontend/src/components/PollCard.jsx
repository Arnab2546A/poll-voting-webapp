import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PollCard({ poll, hasVoted = false, onDeleted }) {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const fetchCreator = async () => {
      if (poll.created_by) {
        // Get display name from a public RPC function
        const { data: userData } = await supabase.rpc(
          "get_user_display_name",
          { user_id: poll.created_by }
        );

        if (userData) {
          setCreatorName(userData);
        }
      }
    };
    fetchCreator();
  }, [poll.created_by]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Added: check the logged-in user to show owner-only delete action
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id || null);
    };

    void fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchVoteCount = async () => {
      const { count, error } = await supabase
        .from("votes")
        .select("*", { count: "exact" })
        .eq("poll_id", poll.id);

      if (!error) {
        setVoteCount(count || 0);
      }
    };

    fetchVoteCount();
  }, [poll.id]);

  const handleDelete = async () => {
    if (!currentUserId || currentUserId !== poll.created_by) return;

    // Added: guard to avoid accidental deletes
    const confirmed = window.confirm("Delete this poll? This cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);

    const { error } = await supabase
      .from("polls")
      .delete()
      .eq("id", poll.id)
      .eq("created_by", currentUserId);

    setIsDeleting(false);

    if (!error) {
      // Added: notify parent to remove card from list
      onDeleted?.(poll.id);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "just now";
    }
  };

  return (
    <div className="glass-surface surface-3d tilt-3d card-hover-lift rounded-2xl shadow-sm hover:shadow-lg p-5 sm:p-6 border border-blue-200/50 hover:border-blue-300 group animate-float-in transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Header: Creator Info + Delete Button */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {creatorName ? creatorName[0]?.toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {creatorName || "Community Member"}
              </p>
              <p className="text-xs text-slate-500">
                {formatDateTime(poll.created_at)}
              </p>
            </div>
          </div>

          {currentUserId === poll.created_by && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Poll Question */}
        <div className="mb-5 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-700 transition-colors duration-200 leading-snug">
            {poll.question}
          </h3>
        </div>

        {/* Footer: Vote Count + Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🗳️</span>
              <span className="text-sm font-bold text-blue-600">{voteCount}</span>
              <span className="text-xs text-slate-600">{voteCount === 1 ? "vote" : "votes"}</span>
            </div>
            {hasVoted && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                ✓ Voted
              </span>
            )}
          </div>

          <button
            onClick={() => navigate(`/poll/${poll.id}`)}
            className="btn-3d w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base"
          >
            {hasVoted ? "View Results" : "Vote & View"}
          </button>
        </div>
      </div>
    </div>
  );
}
