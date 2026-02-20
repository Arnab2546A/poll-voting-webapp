import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PollCard({ poll, hasVoted = false }) {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState("");

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
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {poll.question}
          </h3>
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
