import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import PollCard from "./PollCard";

export default function PollList() {
  const [polls, setPolls] = useState([]);
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
          <PollCard key={poll.id} poll={poll} />
        ))
      )}
    </div>
  );
}
