const express = require("express");
const router = express.Router();

const authMid = require("../middleware/authMiddleware");
const roleMid = require("../middleware/roleMiddleware");
const { updateBookingStatus } = require("../controllers/bookingController");
const {
    getOverview,
    getAlerts,
    getBookings,
    getLogs
} = require("../controllers/adminController");

router.get("/overview", authMid, roleMid.requireRole("admin"), getOverview);
router.get("/alerts", authMid, roleMid.requireRole("admin"), getAlerts);
router.get("/bookings", authMid, roleMid.requireRole("admin"), getBookings);
router.patch("/bookings/:id", authMid, roleMid.requireRole("admin"), updateBookingStatus);
router.get("/logs", authMid, roleMid.requireRole("admin"), getLogs);

module.exports = router;
