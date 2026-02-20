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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 mb-4 border border-gray-100 hover:border-blue-200 group">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start justify-between gap-3 w-full">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              {poll.question}
            </h3>
            {currentUserId === poll.created_by && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-semibold text-red-600 border border-red-200 px-2 py-1 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
          {hasVoted && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-300 px-2 py-1 rounded-full whitespace-nowrap">
              ✓ Voted
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate(`/poll/${poll.id}`)}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {hasVoted ? "View Results" : "View & Vote"}
          </button>

          <div className="text-right">
            {creatorName && (
              <p className="text-sm font-medium text-gray-700 mb-1">
                @{creatorName}
              </p>
            )}
            {poll.created_at && (
              <>
                <p className="text-xs text-gray-500">
                  {formatDateTime(poll.created_at).date}
                </p>
                <p className="text-xs text-gray-400">
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
