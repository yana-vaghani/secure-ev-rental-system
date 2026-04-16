import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../api/services";
import { LoadingButton } from "../components/LoadingSpinner";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !otp) {
        setError("Please enter both email and OTP");
        setLoading(false);
        return;
      }

      const { data } = await authService.verifyOTP(email, otp);
      login(data.token);
      
      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md card">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Verify OTP</h1>
          <p className="text-gray-600">Enter the code sent to your email</p>
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6-Digit OTP
            </label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="input-field text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            <p className="text-xs text-gray-500 mt-1">Check your email for the OTP code</p>
          </div>

          <LoadingButton
            loading={loading}
            type="submit"
            className="btn-primary w-full"
          >
            Verify & Login
          </LoadingButton>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-900">
            OTP expires in <strong>5 minutes</strong>. Check your email spam folder if you don't see the code.
          </p>
        </div>
      </div>
    </div>
  );
}
