const express = require("express");
const router = express.Router();

const authMid = require("../middleware/authMiddleware");
const roleMid = require("../middleware/roleMiddleware");

const { 
    createBooking, 
    getMyBookings, 
    cancelBooking,
    completeBooking,
    submitReview,
    getPublicReviews,
    getRecommendations,
    chatbotSupport,
    getAllBookings,
    updateBookingStatus 
} = require("../controllers/bookingController");

// User routes
router.post("/", authMid, createBooking);
router.get("/my", authMid, getMyBookings);
router.post("/recommendations", authMid, getRecommendations);
router.post("/chatbot", authMid, chatbotSupport);
router.patch("/:id/cancel", authMid, cancelBooking);
router.patch("/:id/complete", authMid, completeBooking);
router.post("/:id/review", authMid, submitReview);
router.get("/reviews/public", getPublicReviews);

// Admin routes
router.get("/all", authMid, roleMid.requireRole(["admin"]), getAllBookings);
router.patch("/:id", authMid, roleMid.requireRole(["admin"]), updateBookingStatus);

module.exports = router;