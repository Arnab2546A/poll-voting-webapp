import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import PollCard from "./PollCard";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
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

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;

  return (
    <div>
      {polls.length === 0 ? (
        <p>No polls available</p>
      ) : (
        polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} hasVoted={votedPollIds.includes(poll.id)} />
        ))
      )}
    </div>
  );
}
