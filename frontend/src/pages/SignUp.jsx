import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailError, setEmailError] = useState("");

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check username availability as user types (with debouncing)
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        setUsernameError("");
        return;
      }

      setUsernameChecking(true);
      setUsernameError("");

      try {
        const { data: exists, error } = await supabase.rpc(
          'check_username_exists',
          { username_to_check: username }
        );

        if (error) {
          console.warn("Username check error:", error);
          setUsernameAvailable(null);
          setUsernameError("");
        } else if (exists) {
          setUsernameAvailable(false);
          setUsernameError("Username is already taken");
        } else {
          setUsernameAvailable(true);
          setUsernameError("");
        }
      } catch (err) {
        console.error("Username check failed:", err);
        setUsernameAvailable(null);
        setUsernameError("");
      } finally {
        setUsernameChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Check email availability as user types (with debouncing)
  useEffect(() => {
    const checkEmail = async () => {
      if (!email || email.length < 5) {
        setEmailAvailable(null);
        setEmailError("");
        return;
      }

      // Check email format validity first
      if (!isValidEmail(email)) {
        setEmailAvailable(false);
        setEmailError("Please enter a valid email address");
        return;
      }

      setEmailChecking(true);
      setEmailError("");

      try {
        const { data: exists, error } = await supabase.rpc(
          'check_email_exists',
          { email_to_check: email }
        );

        if (error) {
          console.warn("Email check error:", error);
          setEmailAvailable(null);
          setEmailError("");
        } else if (exists) {
          setEmailAvailable(false);
          setEmailError("Email is already registered. Please login instead.");
        } else {
          setEmailAvailable(true);
          setEmailError("");
        }
      } catch (err) {
        console.error("Email check failed:", err);
        setEmailAvailable(null);
        setEmailError("");
      } finally {
        setEmailChecking(false);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Double-check username availability right before signup
      const { data: exists, error: checkError } = await supabase.rpc(
        'check_username_exists',
        { username_to_check: username }
      );

      if (!checkError && exists) {
        throw new Error("Username was just taken by another user. Please choose a different one.");
      }

      // Double-check email availability right before signup
      const { data: emailExists, error: emailCheckError } = await supabase.rpc(
        'check_email_exists',
        { email_to_check: email }
      );

      if (!emailCheckError && emailExists) {
        throw new Error("Email was just registered by another user. Please use a different email or login.");
      }

      // Sign up with username stored in auth table
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            full_name: username, // This populates the Display name column
          },
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          throw new Error("This email is already registered. Please use a different email or login.");
        } else if (error.message.includes("duplicate") || error.message.includes("already exists")) {
          throw new Error("This email is already taken. Please use a different email.");
        }
        throw error;
      }

      if (data.user) {
        console.log("User created successfully");
        console.log("Username stored in auth:", data.user.user_metadata.username);
        console.log("Display name:", data.user.user_metadata.full_name);
      }

      setLoading(false);
      alert("Signup successful! Please check your email to verify.");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500">Join us and start creating polls</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter username (min 3 characters)"
                  required
                  minLength={3}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${
                    usernameAvailable === false
                      ? "border-red-500 focus:ring-red-500"
                      : usernameAvailable === true
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {usernameChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
                {!usernameChecking && usernameAvailable === true && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {!usernameChecking && usernameAvailable === false && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              {usernameError && (
                <p className="mt-1 text-sm text-red-600">{usernameError}</p>
              )}
              {usernameAvailable === true && username.length >= 3 && (
                <p className="mt-1 text-sm text-green-600">Username is available!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${
                    emailAvailable === false
                      ? "border-red-500 focus:ring-red-500"
                      : emailAvailable === true
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {emailChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
                {!emailChecking && emailAvailable === true && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {!emailChecking && emailAvailable === false && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
              {emailAvailable === true && email.length >= 5 && (
                <p className="mt-1 text-sm text-green-600">Email is available!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || usernameChecking || emailChecking || usernameAvailable === false || emailAvailable === false || username.length < 3}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
