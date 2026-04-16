import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../api/services";
import { LoadingButton } from "../components/LoadingSpinner";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      await authService.login(email, password);
      // Navigate to OTP verification
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md card">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold text-secondary mb-2">EV Rental</h1>
          <p className="text-gray-600">Secure Vehicle Booking System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-danger" size={20} />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <LoadingButton
            loading={loading}
            type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </LoadingButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </div>

        {/* Test credentials hint */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-semibold text-blue-900 mb-2">Test Credentials:</p>
          <p className="text-blue-800">Email: test@example.com</p>
          <p className="text-blue-800">Password: password123</p>
        </div>
      </div>
    </div>
  );
}
