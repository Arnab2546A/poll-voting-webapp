import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Result from "../components/Result";
import Navbar from "../components/Navbar";

const buildResults = (voteRows, optionRows) => {
  const voteCountMap = (voteRows || []).reduce((accumulator, vote) => {
    accumulator[vote.option_id] = (accumulator[vote.option_id] || 0) + 1;
    return accumulator;
  }, {});

  return (optionRows || []).map((option) => ({
    id: option.id,
    option_text: option.option_text,
    count: voteCountMap[option.id] || 0,
  }));
};

const fetchVoteRows = async (pollId) => {
  const { data, error } = await supabase
    .from("votes")
    .select("option_id")
    .eq("poll_id", pollId);

  if (error) return null;
  return data || [];
};

export default function PollDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoteStatusLoading, setIsVoteStatusLoading] = useState(true);
  const [userVotedOptionId, setUserVotedOptionId] = useState(null);

  const resetPollViewState = () => {
    setIsVoteStatusLoading(true);
    setHasVoted(false);
    setShowResults(false);
    setResults([]);
    setSelected(null);
    setMessage("");
    setUserVotedOptionId(null);
  };

  const fetchResults = useCallback(async () => {
    const voteRows = await fetchVoteRows(id);

    if (!voteRows) return;

    setResults(buildResults(voteRows, options));
  }, [id, options]);

  useEffect(() => {
    const fetchPoll = async () => {
      resetPollViewState();

      const [{ data: pollData }, { data: optionData }] = await Promise.all([
        supabase.from("polls").select("*").eq("id", id).single(),
        supabase.from("options").select("*").eq("poll_id", id),
      ]);

      setPoll(pollData);
      setOptions(optionData || []);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingVote } = await supabase
          .from("votes")
          .select("id, option_id")
          .eq("poll_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingVote) {
          setHasVoted(true);
          setShowResults(true);
          setUserVotedOptionId(existingVote.option_id);

          const voteRows = await fetchVoteRows(id);

          if (voteRows) {
            setResults(buildResults(voteRows, optionData));
          }
        }
      }

      setIsVoteStatusLoading(false);
    };

    void fetchPoll();
  }, [id]);

  const handleVote = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Login required to vote.");
      return;
    }

    const { error } = await supabase.from("votes").insert([
      {
        user_id: user.id,
        poll_id: id,
        option_id: selected,
      },
    ]);

    if (error) {
      setMessage("You have already voted in this poll.");
      setHasVoted(true);
      setShowResults(true);
      await fetchResults();
    } else {
      setMessage("Vote submitted successfully!");
      setHasVoted(true);
      setShowResults(true);
      setUserVotedOptionId(selected);
      setSelected(null);
      await fetchResults();
    }
  };

  if (!poll || isVoteStatusLoading) {
    return (
      <div className="min-h-screen world-hero flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-700 text-base sm:text-lg font-medium">Loading poll...</p>
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

      <div className="relative z-10 py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Poll Question Hero */}
          <div className="animate-float-in mb-8 sm:mb-10">
            <div className="glass-surface surface-3d tilt-3d rounded-3xl p-6 sm:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌍</span>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Global Poll</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 leading-tight mb-3">
                {poll.question}
              </h1>
            </div>
          </div>

          {!showResults ? (
            <>
              {/* Voting Section */}
              <div className="animate-float-in" style={{ animationDelay: "0.05s" }}>
                <div className="glass-surface surface-3d rounded-2xl p-6 sm:p-10">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950 mb-6">Choose Your Answer</h2>

                  {/* Option Cards */}
                  <div className="space-y-3 mb-8">
                    {options.map((option, idx) => (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 transform hover:scale-102 animate-float-in ${
                          selected === option.id
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-teal-50 shadow-lg"
                            : "border-blue-200 bg-blue-50/40 hover:border-teal-400 hover:bg-teal-50/50"
                        }`}
                        style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                      >
                        <input
                          type="radio"
                          name="option"
                          value={option.id}
                          onChange={() => setSelected(option.id)}
                          className="w-6 h-6 text-blue-600 cursor-pointer accent-blue-600 flex-shrink-0"
                        />
                        <span className="ml-4 text-slate-950 font-semibold text-base sm:text-lg">{option.option_text}</span>
                      </label>
                    ))}
                  </div>

                  {/* Submit Vote Button */}
                  <button
                    onClick={handleVote}
                    disabled={!selected}
                    className="w-full py-4 sm:py-5 btn-3d bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg text-base sm:text-lg"
                  >
                    Submit Your Vote
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results Section */}
              <div className="animate-float-in" style={{ animationDelay: "0.05s" }}>
                <Result hasVoted={hasVoted} results={results} userVotedOptionId={userVotedOptionId} />
              </div>
            </>
          )}

          {/* Message Alert */}
          {message && (
            <div
              className={`mt-6 animate-float-in p-5 sm:p-6 rounded-2xl font-semibold text-center border-2 ${
                message.includes("successfully")
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : "bg-red-50 text-red-900 border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 sm:mt-8 py-3 sm:py-4 text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
          >
            ← Back to Polls
          </button>
        </div>
      </div>
    </div>
  );
}
