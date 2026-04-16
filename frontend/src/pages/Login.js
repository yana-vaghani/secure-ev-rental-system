import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            alert(typeof res.data === "string" ? res.data : res.data.message || "OTP sent");

            // ✅ Redirect to OTP page
            navigate("/verify", { state: { email } });
        } catch (err) {
            const message = err.response?.data || "Login failed. Please try again.";
            setError(typeof message === "string" ? message : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = () => {
        setEmail("test@example.com");
        setPassword("password123");
        setError("");
    };

    return (
        <div className="page-shell">
            <div className="card">
                <div className="brand">⚡ Secure EV Rental</div>
                <h2 className="title">Welcome back</h2>
                <p className="subtitle">Login to continue to your dashboard and manage bookings.</p>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="input" placeholder="Enter password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <button className="btn" onClick={handleLogin} disabled={loading}>
                    {loading ? "Sending OTP..." : "Login"}
                </button>

                <button className="btn btn-secondary mt-12" onClick={fillDemo}>
                    Fill demo credentials
                </button>

                {error && <p className="message message-error mt-12">{error}</p>}

                <p className="center mt-16">
                    Don&apos;t have an account? <Link className="link" to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;