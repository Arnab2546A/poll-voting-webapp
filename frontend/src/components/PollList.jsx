import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../supabaseClient";
import PollCard from "./PollCard";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchPolls = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setPolls(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("poll_id")
          .eq("user_id", user.id);

        if (!votesError) {
          const ids = (votesData || []).map((vote) => vote.poll_id);
          setVotedPollIds(ids);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();

    // Refetch polls when window regains focus (e.g., navigating back from another tab/page)
    const handleFocus = () => {
      fetchPolls();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPolls]);

  const handlePollDeleted = (deletedId) => {
    // Added: remove deleted poll without refetching the whole list
    setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== deletedId));
    setVotedPollIds((prevIds) => prevIds.filter((pollId) => pollId !== deletedId));
  };

  if (loading) {
    return (
      <div className="glass-surface surface-3d rounded-2xl p-8 text-center border border-white/70 shadow-sm">
        <div className="inline-flex items-center gap-3 text-slate-600">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-medium">Loading polls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-float-in">
      {/* Refresh Button */}
      <div className="mb-5 flex items-center justify-end gap-3 flex-wrap">
        <button
          onClick={() => fetchPolls()}
          disabled={isRefreshing}
          className="btn-3d refresh-accent px-4 py-2 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {polls.length === 0 ? (
        <div className="glass-surface surface-3d rounded-2xl border border-white/70 p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No polls available</h3>
          <p className="text-slate-600 text-sm">Create a new poll to get started.</p>
        </div>
      ) : (
        <div className="feed-list space-y-4 sm:space-y-5">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              hasVoted={votedPollIds.includes(poll.id)}
              onDeleted={handlePollDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
