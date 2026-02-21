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
      <div className="app-shell flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-900 text-base sm:text-lg font-medium">Loading poll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="world-hero glass-surface surface-3d tilt-3d rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-sm relative">
          <div className="hero-glow-orb hero-glow-orb--one" />
          <div className="hero-glow-orb hero-glow-orb--two" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-800 world-chip mb-3">
              🌍 Global Pulse
            </span>
            <h1 className="section-title hero-gradient-title text-2xl sm:text-3xl font-extrabold mb-2">
              Live Poll Connection
            </h1>
            <p className="text-sm sm:text-base text-slate-900">
              Add your voice and see how the community is leaning in real time.
            </p>
          </div>
        </div>

        {/* Poll Card */}
        <div className="glass-surface surface-3d rounded-2xl shadow-xl p-5 sm:p-8 border border-white/70">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-2">{poll.question}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
          </div>

          {!showResults ? (
            <>
              {/* Options */}
              <div className="space-y-3 mb-8">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selected === option.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option.id}
                      onChange={() => setSelected(option.id)}
                      className="w-5 h-5 text-blue-600 cursor-pointer accent-blue-600"
                    />
                    <span className="ml-4 text-slate-950 font-medium text-base sm:text-lg">{option.option_text}</span>
                  </label>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleVote}
                disabled={!selected}
                className="btn-3d w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Vote
              </button>
            </>
          ) : (
            <Result hasVoted={hasVoted} results={results} userVotedOptionId={userVotedOptionId} />
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 py-3 border border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Back to Home
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-semibold ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
