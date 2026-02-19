import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CreatePoll from "./pages/CreatePoll";
import PollDetail from "./pages/PollDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreatePoll />} />
      <Route path="/poll/:id" element={<PollDetail />} />
    </Routes>
  );
}

export default App;