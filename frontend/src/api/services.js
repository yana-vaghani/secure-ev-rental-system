import API from "./axiosInstance";

export const authService = {
  register: (data) => API.post("/auth/register", data),
  login: (email, password) => API.post("/auth/login", { email, password }),
  verifyOTP: (email, otp) => API.post("/auth/verify-otp", { email, otp }),
  logout: () => API.post("/auth/logout"),
  refresh: () => API.post("/auth/refresh"),
};

export const bookingService = {
  getMyBookings: () => API.get("/bookings/my"),
  createBooking: (data) => API.post("/bookings", data),
  cancelBooking: (id) => API.patch(`/bookings/${id}/cancel`),
  completeBooking: (id, data) => API.patch(`/bookings/${id}/complete`, data),
  submitReview: (id, data) => API.post(`/bookings/${id}/review`, data),
  getPublicReviews: () => API.get("/bookings/reviews/public"),
  getRecommendations: (payload) => API.post("/bookings/recommendations", payload),
  chatbot: (message) => API.post("/bookings/chatbot", { message }),
};

export const adminService = {
  getOverview: () => API.get("/admin/overview"),
  getAlerts: () => API.get("/admin/alerts"),
  getAllBookings: () => API.get("/admin/bookings"),
  approveBooking: (id, reason) =>
    API.patch(`/admin/bookings/${id}`, { status: "approved", reason }),
  rejectBooking: (id, reason) =>
    API.patch(`/admin/bookings/${id}`, { status: "rejected", reason }),
  getActivityLogs: () => API.get("/admin/logs"),
};
