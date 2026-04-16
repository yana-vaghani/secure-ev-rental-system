import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Dashboard() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    const fetchBookings = async () => {
        try {
            setError("");
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            const res = await API.get("/bookings/my", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const message = err.response?.data || "Failed to load bookings.";
            setError(typeof message === "string" ? message : "Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const statusOk = statusFilter === "all" || booking.status === statusFilter;
            const searchOk = booking.vehicleName?.toLowerCase().includes(search.toLowerCase());
            return statusOk && searchOk;
        });
    }, [bookings, statusFilter, search]);

    const stats = useMemo(() => {
        const total = bookings.length;
        const approved = bookings.filter((b) => b.status === "approved").length;
        const pending = bookings.filter((b) => b.status === "pending").length;
        return { total, approved, pending };
    }, [bookings]);

    const handleCancel = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await API.put(`/bookings/cancel/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchBookings();
        } catch (err) {
            const message = err.response?.data || "Failed to cancel booking.";
            setError(typeof message === "string" ? message : "Failed to cancel booking.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <div className="page-shell">
            <div className="card card-wide">
                <div className="topbar">
                    <div>
                        <div className="brand">📊 Secure EV Rental</div>
                        <h2 className="title">My Bookings</h2>
                    </div>
                    <div className="row">
                        <Link className="btn btn-secondary btn-inline" to="/book">+ New Booking</Link>
                        <button className="btn btn-secondary btn-inline" onClick={fetchBookings}>Refresh</button>
                        <button className="btn btn-danger btn-inline" onClick={logout}>Logout</button>
                    </div>
                </div>

                <div className="grid">
                    <div className="stat">
                        <div className="stat-label">Total bookings</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{stats.approved}</div>
                    </div>
                </div>

                <div className="toolbar">
                    <input
                        className="input"
                        placeholder="Search by vehicle name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {error && <p className="message message-error">{error}</p>}

                {loading ? (
                    <p className="subtitle">Loading bookings...</p>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty">No bookings found. Click <b>New Booking</b> to create one.</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((b) => (
                                <tr key={b._id}>
                                    <td>{b.vehicleName}</td>
                                    <td>{new Date(b.startTime).toLocaleString()}</td>
                                    <td>{new Date(b.endTime).toLocaleString()}</td>
                                    <td>
                                        <span className={`status status-${b.status}`}>{b.status}</span>
                                    </td>
                                    <td>
                                        {b.status === "pending" ? (
                                            <button className="btn btn-danger btn-inline" onClick={() => handleCancel(b._id)}>
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="chip">No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;