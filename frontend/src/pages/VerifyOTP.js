import React, { useState } from "react";
import API from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function VerifyOTP() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [email, setEmail] = useState(state?.email || "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!email || !otp) {
            setError("Please enter both email and OTP.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/verify-otp", { email, otp });

            localStorage.setItem("token", res.data.token);

            alert("Login successful");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const message = err.response?.data || "OTP verification failed. Please try again.";
            setError(typeof message === "string" ? message : "OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="card">
                <div className="brand">🔐 Secure EV Rental</div>
                <h2 className="title">Verify OTP</h2>
                <p className="subtitle">We sent a one-time passcode to your email.</p>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">OTP Code</label>
                    <input className="input" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                </div>

                <button className="btn" onClick={handleVerify} disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                {error && <p className="message message-error mt-12">{error}</p>}

                <p className="center mt-16">
                    Wrong email? <Link className="link" to="/">Go back to login</Link>
                </p>
            </div>
        </div>
    );
}

export default VerifyOTP;