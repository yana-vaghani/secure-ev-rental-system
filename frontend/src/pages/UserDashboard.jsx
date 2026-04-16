import React, { useEffect, useMemo, useState } from "react";
import { bookingService } from "../api/services";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle, MessageCircle, Route, Star, Wrench } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [publicReviews, setPublicReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("Ask me about OTP, booking status, cancellations, or damage reporting.");

  const [recommendationForm, setRecommendationForm] = useState({
    distanceKm: 25,
    passengers: 1,
    withFamily: false
  });
  const [recommendations, setRecommendations] = useState([]);

  const [reviewDrafts, setReviewDrafts] = useState({});

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [myBookingsRes, reviewsRes] = await Promise.all([
        bookingService.getMyBookings(),
        bookingService.getPublicReviews()
      ]);
      setBookings(myBookingsRes.data || []);
      setPublicReviews(reviewsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => (filter === "all" ? true : booking.status === filter));
  }, [bookings, filter]);

  const stats = useMemo(
    () => [
      { label: "Total Bookings", value: bookings.length, icon: "📅" },
      { label: "Active", value: bookings.filter((b) => b.status === "approved").length, icon: "✅" },
      { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, icon: "⏳" },
      { label: "Completed", value: bookings.filter((b) => b.isCompleted).length, icon: "🏁" }
    ],
    [bookings]
  );

  const handleAskBot = async () => {
    try {
      if (!chatInput.trim()) return;
      const { data } = await bookingService.chatbot(chatInput);
      setChatReply(data.reply || "I couldn't understand that. Please try again.");
    } catch (err) {
      setChatReply(err.response?.data?.message || "Chatbot service unavailable right now.");
    }
  };

  const handleRecommendations = async () => {
    try {
      const { data } = await bookingService.getRecommendations(recommendationForm);
      setRecommendations(data.recommended || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recommendations");
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId, {
        distanceTravelledKm: Number(reviewDrafts[bookingId]?.distanceTravelledKm || 0),
        damageReported: Boolean(reviewDrafts[bookingId]?.damageReported),
        damageNotes: reviewDrafts[bookingId]?.damageNotes || ""
      });
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete trip");
    }
  };

  const handleSubmitReview = async (bookingId) => {
    try {
      await bookingService.submitReview(bookingId, {
        rating: Number(reviewDrafts[bookingId]?.rating || 5),
        comment: reviewDrafts[bookingId]?.comment || "",
        sharedOnPlatform: true
      });
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary">Welcome, {user?.name || "Rider"}</h1>
        <p className="text-gray-600 mt-2">Smart support, trip recommendations, and review sharing in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-danger" />
          <span className="text-danger">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <Route className="text-primary" />
            <h2 className="text-xl font-bold">EV Recommendation Assistant</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input-field"
              type="number"
              value={recommendationForm.distanceKm}
              onChange={(e) => setRecommendationForm((s) => ({ ...s, distanceKm: e.target.value }))}
              placeholder="Distance (km)"
            />
            <input
              className="input-field"
              type="number"
              value={recommendationForm.passengers}
              onChange={(e) => setRecommendationForm((s) => ({ ...s, passengers: e.target.value }))}
              placeholder="Passengers"
            />
            <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={recommendationForm.withFamily}
                onChange={(e) => setRecommendationForm((s) => ({ ...s, withFamily: e.target.checked }))}
              />
              Traveling with family
            </label>
          </div>
          <button onClick={handleRecommendations} className="btn-primary w-full">Get Recommendations</button>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <p className="font-semibold">{rec.model} ({rec.type})</p>
                <p className="text-sm text-gray-600">{rec.reason} · seats {rec.seats} · ideal {rec.idealKm} km</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-primary" />
            <h2 className="text-xl font-bold">Support Chatbot</h2>
          </div>
          <textarea
            className="input-field min-h-[120px]"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Describe your issue..."
          />
          <button onClick={handleAskBot} className="btn-primary w-full">Ask for Help</button>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-sm">{chatReply}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <h2 className="text-2xl font-bold">My Bookings & Returns</h2>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected", "cancelled", "flagged"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize transition ${filter === f ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No bookings found for this filter.</div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.vehicleName}</h3>
                    <p className="text-sm text-gray-600">{booking.station} · {new Date(booking.startTime).toLocaleString()} → {new Date(booking.endTime).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">{booking.status}</span>
                </div>

                {!booking.isCompleted && (booking.status === "approved" || booking.status === "pending") && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 space-y-2">
                    <p className="font-medium text-sm">Return details (for usage/damage analytics)</p>
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        className="input-field"
                        type="number"
                        placeholder="Distance (km)"
                        value={reviewDrafts[booking._id]?.distanceTravelledKm || ""}
                        onChange={(e) => setReviewDrafts((s) => ({ ...s, [booking._id]: { ...s[booking._id], distanceTravelledKm: e.target.value } }))}
                      />
                      <label className="flex items-center gap-2 text-sm px-2">
                        <input
                          type="checkbox"
                          checked={Boolean(reviewDrafts[booking._id]?.damageReported)}
                          onChange={(e) => setReviewDrafts((s) => ({ ...s, [booking._id]: { ...s[booking._id], damageReported: e.target.checked } }))}
                        />
                        Damage reported
                      </label>
                      <button className="btn-secondary" onClick={() => handleCompleteTrip(booking._id)}>
                        Mark as Returned
                      </button>
                    </div>
                    <input
                      className="input-field"
                      placeholder="Damage notes (optional)"
                      value={reviewDrafts[booking._id]?.damageNotes || ""}
                      onChange={(e) => setReviewDrafts((s) => ({ ...s, [booking._id]: { ...s[booking._id], damageNotes: e.target.value } }))}
                    />
                  </div>
                )}

                {booking.isCompleted && !booking.review?.rating && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 space-y-2">
                    <p className="font-medium text-sm">Share your ride experience</p>
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        className="input-field"
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rating 1-5"
                        value={reviewDrafts[booking._id]?.rating || ""}
                        onChange={(e) => setReviewDrafts((s) => ({ ...s, [booking._id]: { ...s[booking._id], rating: e.target.value } }))}
                      />
                      <input
                        className="input-field md:col-span-2"
                        placeholder="How was your experience?"
                        value={reviewDrafts[booking._id]?.comment || ""}
                        onChange={(e) => setReviewDrafts((s) => ({ ...s, [booking._id]: { ...s[booking._id], comment: e.target.value } }))}
                      />
                    </div>
                    <button className="btn-primary" onClick={() => handleSubmitReview(booking._id)}>Submit Review</button>
                  </div>
                )}

                {booking.damageReported && (
                  <div className="mt-3 text-sm text-red-700 flex items-center gap-2"><Wrench size={16} /> Damage noted: {booking.damageNotes || "No details"}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-primary" />
          <h2 className="text-2xl font-bold">Community Experience Wall</h2>
        </div>
        <div className="space-y-3">
          {publicReviews.length === 0 ? (
            <p className="text-gray-500">No shared reviews yet.</p>
          ) : (
            publicReviews.slice(0, 8).map((r) => (
              <div key={r.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{r.userName} · {r.vehicleName}</p>
                  <p className="text-yellow-600">{"★".repeat(Math.max(1, Number(r.rating || 0)))}</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">{r.comment || "Great ride experience!"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
