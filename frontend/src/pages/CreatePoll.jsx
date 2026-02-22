import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";

export default function CreatePoll() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  
  // Alert state
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "info" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, index: null });

  const showAlert = (message, type = "info") => {
    setAlert({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  // Add new option field
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Handle option text change
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  // Delete option - show confirmation
  const handleDeleteClick = (index) => {
    if (options.length <= 2) {
      showAlert("A poll must have at least 2 options", "error");
      return;
    }
    setConfirmDelete({ isOpen: true, index });
  };

  // Confirm delete option
  const confirmDeleteOption = () => {
    const updated = options.filter((_, i) => i !== confirmDelete.index);
    setOptions(updated);
    setConfirmDelete({ isOpen: false, index: null });
  };

  // Submit poll
  const handleCreatePoll = async () => {
    // Validate question
    if (!question.trim()) {
      showAlert("Please enter a poll question", "error");
      return;
    }

    // Validate options
    const emptyOptions = options.some((opt) => !opt.trim());
    if (emptyOptions) {
      showAlert("All options must be filled in", "error");
      return;
    }

    // Get logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showAlert("Login required", "error");
      return;
    }

    // Insert poll
    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .insert([
        {
          question: question,
          created_by: user.id,
        },
      ])
      .select();

    if (pollError) {
      showAlert(pollError.message, "error");
      return;
    }

    const pollId = pollData[0].id;

    // Insert options
    const optionRows = options.map((opt) => ({
      poll_id: pollId,
      option_text: opt,
    }));

    const { error: optionError } = await supabase
      .from("options")
      .insert(optionRows);

    if (optionError) {
      showAlert(optionError.message, "error");
      return;
    }

    showAlert("Poll created successfully!", "success");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen world-hero">
      <Navbar />
      
      {/* Decorative glow orbs */}
      <div className="hero-glow-orb hero-glow-orb--one"></div>
      <div className="hero-glow-orb hero-glow-orb--two"></div>

      <div className="relative z-10 py-12 sm:py-16 px-4">
        <div className="max-w-2xl mx-auto animate-float-in">
          {/* Header section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="hero-gradient-title text-3xl sm:text-5xl font-bold mb-3">
              Create a Poll
            </h1>
            <p className="text-slate-700 text-base sm:text-lg">
              Share your question with the global community
            </p>
          </div>

          {/* Main card */}
          <div className="glass-surface surface-3d tilt-3d rounded-2xl p-6 sm:p-10 backdrop-blur-md">
            {/* Question input */}
            <div className="mb-8 sm:mb-10">
              <label className="block text-sm font-semibold text-slate-950 mb-3">
                Poll Question
              </label>
              <input
                type="text"
                placeholder="What's your question?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-5 py-4 sm:py-5 text-lg rounded-xl border-2 border-blue-200 bg-blue-50/50 text-slate-950 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-teal-300 focus:bg-blue-50"
              />
            </div>

            {/* Options section */}
            <div className="mb-8 sm:mb-10">
              <label className="block text-sm font-semibold text-slate-950 mb-4">
                Answer Options
              </label>

              <div className="space-y-3 sm:space-y-4">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="animate-float-in flex flex-col sm:flex-row gap-3 items-stretch sm:items-center group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-teal-600 pointer-events-none">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full pl-8 pr-4 py-3 sm:py-3.5 rounded-lg border-2 border-teal-200 bg-teal-50/40 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-teal-300 focus:bg-teal-50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(index)}
                      className="px-4 py-2.5 sm:py-3 sm:px-4 bg-gradient-to-r from-red-400 to-red-500 text-white text-sm font-medium rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 sm:opacity-100 w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={addOption}
                className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-semibold rounded-lg hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                + Add Option
              </button>

              <button
                onClick={handleCreatePoll}
                className="flex-1 px-6 py-3 sm:py-4 btn-3d bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
              >
                Create Poll
              </button>
            </div>

            {/* Info text */}
            <p className="text-xs sm:text-sm text-slate-600 text-center mt-6">
              Polls must have at least 2 options. Share your poll and engage with the community!
            </p>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <Alert
        isOpen={alert.isOpen}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />

      {/* Confirm Delete Modal */}
      <Alert
        isOpen={confirmDelete.isOpen}
        message={`Are you sure you want to delete Option ${confirmDelete.index !== null ? confirmDelete.index + 1 : ""}?`}
        type="confirm"
        onClose={() => setConfirmDelete({ isOpen: false, index: null })}
        onConfirm={confirmDeleteOption}
      />
    </div>
  );
}
