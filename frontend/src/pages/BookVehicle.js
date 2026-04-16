import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function BookVehicle() {
    const navigate = useNavigate();
    const [vehicleName, setVehicle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const durationInHours = (() => {
        if (!startTime || !endTime) return 0;
        const diff = new Date(endTime) - new Date(startTime);
        return diff > 0 ? diff / (1000 * 60 * 60) : 0;
    })();
    const estimatedFare = durationInHours > 0 ? durationInHours * 150 : 0;

    const handleBook = async () => {
        try {
            setError("");
            setSuccess("");
            setLoading(true);
            const token = localStorage.getItem("token");

            // ❗ Check if token exists
            if (!token) {
                setError("Please login first.");
                return;
            }

            // ❗ Basic validation
            if (!vehicleName || !startTime || !endTime) {
                setError("Please fill all fields.");
                return;
            }

            if (new Date(endTime) <= new Date(startTime)) {
                setError("End time must be after start time.");
                return;
            }

            await API.post(
                "/bookings",
                {
                    vehicleName,
                    startTime,
                    endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Booking created successfully.");
            setTimeout(() => navigate("/dashboard"), 800);

        } catch (err) {
            const message = err.response?.data || "Booking failed.";
            setError(typeof message === "string" ? message : "Booking failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="card">
                <div className="brand">🚘 Secure EV Rental</div>
                <h2 className="title">Book your EV</h2>
                <p className="subtitle">Choose timing and we&apos;ll prepare your booking instantly.</p>

                <div className="form-group">
                    <label className="form-label">Vehicle Name</label>
                    <input
                        className="input"
                        type="text"
                        placeholder="e.g. Tesla Model 3"
                        value={vehicleName}
                        onChange={(e) => setVehicle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                        className="input"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                        className="input"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                {durationInHours > 0 && (
                    <div className="message message-success mt-12">
                        Estimated duration: <b>{durationInHours.toFixed(2)} hrs</b> · Estimated fare: <b>₹{estimatedFare.toFixed(0)}</b>
                    </div>
                )}

                <button className="btn mt-12" onClick={handleBook} disabled={loading}>
                    {loading ? "Creating booking..." : "Book Now"}
                </button>

                {error && <p className="message message-error mt-12">{error}</p>}
                {success && <p className="message message-success mt-12">{success}</p>}

                <p className="center mt-16">
                    Want to check your trips? <Link className="link" to="/dashboard">Go to dashboard</Link>
                </p>
            </div>
        </div>
    );
}

export default BookVehicle;