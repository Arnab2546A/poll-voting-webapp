import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PollCard({ poll, hasVoted = false, onDeleted }) {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const dateFormatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  return (
    <div className="glass-surface surface-3d tilt-3d card-hover-lift rounded-2xl shadow-sm hover:shadow-lg p-4 sm:p-6 border border-white/70 hover:border-blue-200/80 group animate-float-in">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start justify-between gap-3 w-full">
            <h3 className="text-base sm:text-lg font-semibold text-slate-950 group-hover:text-blue-700 transition-colors duration-200 leading-snug">
              {poll.question}
            </h3>

            {currentUserId === poll.created_by && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
          {hasVoted && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100/90 border border-green-300 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
              ✓ Voted
            </span>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-200/70">
          <button
            onClick={() => navigate(`/poll/${poll.id}`)}
            className="btn-3d w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            {hasVoted ? "View Results" : "View & Vote"}
          </button>

          <div className="text-left sm:text-right">
            {creatorName && (
              <p className="text-sm font-medium text-slate-700 mb-1">
                @{creatorName}
              </p>
            )}
            {poll.created_at && (
              <>
                <p className="text-xs text-slate-500">
                  {formatDateTime(poll.created_at).date}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDateTime(poll.created_at).time}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
