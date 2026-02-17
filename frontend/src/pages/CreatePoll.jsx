import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

export default function CreatePoll() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(true);
  
  // Alert state
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "info" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, index: null });

  const showAlert = (message, type = "info") => {
    setAlert({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Poll</h2>

        <input
          type="text"
          placeholder="Enter poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />

        <h4 className="text-lg font-semibold text-gray-700 mb-4">Options:</h4>

        {options.map((opt, index) => (
          <div key={index} className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => handleDeleteClick(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button
            onClick={addOption}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Add Option
          </button>

          <button
            onClick={handleCreatePoll}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Poll
          </button>
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
