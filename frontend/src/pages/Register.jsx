import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        displayName,
        email,
        password,
      });
      login(res.data.user, res.data.token);
      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (err) {
      const message =
        err.response?.data?.error?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign up to find scholarships, internships, and track applications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
