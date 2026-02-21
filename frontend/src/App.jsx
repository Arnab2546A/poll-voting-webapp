import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CreatePoll from "./pages/CreatePoll";
import PollDetail from "./pages/PollDetail";
import MyActivity from "./pages/MyActivity";
import ProtectedRoute from "./components/ProtectedRoute";
import { initAutoCleanup } from "./utils/cleanup";

function App() {
  // Auto-cleanup unverified users on app load
  useEffect(() => {
    initAutoCleanup();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/poll/:id" element={<PollDetail />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-activity"
        element={
          <ProtectedRoute>
            <MyActivity />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;