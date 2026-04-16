const express = require("express");
const router = express.Router();

const authMid = require("../middleware/authMiddleware");
const roleMid = require("../middleware/roleMiddleware");

const { 
    createBooking, 
    getMyBookings, 
    cancelBooking,
    getAllBookings,
    updateBookingStatus 
} = require("../controllers/bookingController");

// User routes
router.post("/", authMid, createBooking);
router.get("/my", authMid, getMyBookings);
router.patch("/:id/cancel", authMid, cancelBooking);

// Admin routes
router.get("/all", authMid, roleMid.requireRole(["admin"]), getAllBookings);
router.patch("/:id", authMid, roleMid.requireRole(["admin"]), updateBookingStatus);

module.exports = router;