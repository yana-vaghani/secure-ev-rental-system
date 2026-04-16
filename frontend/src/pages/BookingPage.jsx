import React, { useState } from "react";
import { bookingService } from "../api/services";
import { AlertCircle, CheckCircle } from "lucide-react";
import { LoadingButton } from "../components/LoadingSpinner";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    vehicleName: "",
    station: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.vehicleName || !formData.station || !formData.startTime || !formData.endTime) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      await bookingService.createBooking(formData);
      setSuccess("Booking created successfully! Check your dashboard.");
      setFormData({
        vehicleName: "",
        station: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Booking failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary">Book Your EV</h1>
        <p className="text-gray-600 mt-2">Reserve an electric vehicle for your next trip</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-danger" size={20} />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="text-primary" size={20} />
              <span className="text-sm text-primary">{success}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a vehicle</option>
              <option value="Tesla Model 3">Tesla Model 3</option>
              <option value="Nissan Leaf">Nissan Leaf</option>
              <option value="BMW i3">BMW i3</option>
              <option value="Chevy Bolt">Chevy Bolt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Charging Station
            </label>
            <select
              name="station"
              value={formData.station}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a station</option>
              <option value="Downtown Station">Downtown Station</option>
              <option value="Airport Station">Airport Station</option>
              <option value="Mall Station">Mall Station</option>
              <option value="Riverside Station">Riverside Station</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <LoadingButton loading={loading} type="submit" className="btn-primary w-full">
            Request Booking
          </LoadingButton>
        </form>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900">
          <strong>Note:</strong> Your booking will be reviewed by our team. You'll receive an email once approved.
        </p>
      </div>
    </div>
  );
}
