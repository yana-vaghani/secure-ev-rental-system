import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await API.post("/auth/register", { name, email, password });
            setSuccess(typeof res.data === "string" ? res.data : "Registered successfully");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            const message = err.response?.data || "Registration failed. Please try again.";
            setError(typeof message === "string" ? message : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="card">
                <div className="brand">🚗 Secure EV Rental</div>
                <h2 className="title">Create account</h2>
                <p className="subtitle">Get started with secure EV booking in less than a minute.</p>

                <div className="form-group">
                    <label className="form-label">Full name</label>
                    <input className="input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="input" placeholder="At least 6 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <button className="btn" onClick={handleRegister} disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                {error && <p className="message message-error mt-12">{error}</p>}
                {success && <p className="message message-success mt-12">{success}</p>}

                <p className="center mt-16">
                    Already have an account? <Link className="link" to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
