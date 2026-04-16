import React, { useEffect, useMemo, useState } from "react";
import { adminService } from "../api/services";
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench } from "lucide-react";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState({ fraudAlerts: [], damageAlerts: [] });
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");
      const [overviewRes, alertsRes, bookingsRes, logsRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getAlerts(),
        adminService.getAllBookings(),
        adminService.getActivityLogs()
      ]);
      setOverview(overviewRes.data);
      setAlerts(alertsRes.data || { fraudAlerts: [], damageAlerts: [] });
      setBookings(bookingsRes.data || []);
      setLogs(logsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => (statusFilter === "all" ? true : b.status === statusFilter));
  }, [bookings, statusFilter]);

  const handleApproval = async (id, status) => {
    try {
      if (status === "approved") {
        await adminService.approveBooking(id, "Approved by admin");
      } else {
        const reason = window.prompt("Rejection reason:", "Vehicle unavailable or policy mismatch") || "Rejected by admin";
        await adminService.rejectBooking(id, reason);
      }
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking status");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary">Admin Command Center</h1>
        <p className="text-gray-600 mt-2">Manage approvals, detect fraud alerts, and monitor vehicle usage + damage reports.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div>}

      {loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Total Users" value={overview?.totalUsers || 0} />
            <StatCard label="Total Bookings" value={overview?.totalBookings || 0} />
            <StatCard label="Pending" value={overview?.pendingApprovals || 0} />
            <StatCard label="Flagged" value={overview?.flaggedAccounts || 0} />
            <StatCard label="Usage Hours" value={overview?.totalUsageHours || 0} />
            <StatCard label="Distance km" value={overview?.totalDistanceKm || 0} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldAlert className="text-amber-500" /> Fraud Alerts</h2>
              <div className="space-y-3 max-h-72 overflow-auto">
                {(alerts.fraudAlerts || []).length === 0 ? (
                  <p className="text-gray-500">No fraud alerts right now.</p>
                ) : (
                  alerts.fraudAlerts.map((item) => (
                    <div key={item._id} className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                      <p className="font-semibold">{item.userId?.name || "User"} · {item.vehicleName}</p>
                      <p className="text-sm text-gray-700">{item.flaggedReason || "Unusual booking behavior detected"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wrench className="text-red-500" /> Damage Alerts</h2>
              <div className="space-y-3 max-h-72 overflow-auto">
                {(alerts.damageAlerts || []).length === 0 ? (
                  <p className="text-gray-500">No damage reports yet.</p>
                ) : (
                  alerts.damageAlerts.map((item) => (
                    <div key={item._id} className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <p className="font-semibold">{item.userId?.name || "User"} · {item.vehicleName}</p>
                      <p className="text-sm text-gray-700">{item.damageNotes || "Damage reported without notes"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold">Booking Approval Queue</h2>
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected", "flagged", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg ${statusFilter === s ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="p-4 border border-gray-200 rounded-lg flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{booking.userId?.name || "User"} · {booking.vehicleName}</p>
                    <p className="text-sm text-gray-600">{booking.station} · usage {booking.usageHours || 0}h · {booking.distanceTravelledKm || 0} km</p>
                    <p className="text-xs text-gray-500">status: {booking.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => handleApproval(booking._id, "approved")}>
                      <CheckCircle2 size={16} className="inline mr-1" />Approve
                    </button>
                    <button className="btn-danger" onClick={() => handleApproval(booking._id, "rejected")}>
                      <AlertTriangle size={16} className="inline mr-1" />Reject
                    </button>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && <p className="text-gray-500">No bookings in this filter.</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Recent System Activity</h2>
            <div className="space-y-2 max-h-64 overflow-auto text-sm">
              {logs.slice(0, 60).map((log) => (
                <div key={log._id} className="p-2 rounded border border-gray-200 bg-gray-50">
                  <span className="font-semibold">{log.action}</span> · {log.userId?.name || "System"} · {new Date(log.timestamp).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
