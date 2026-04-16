const express = require("express");
const router = express.Router();

const authMid = require("../middleware/authMiddleware");
const roleMid = require("../middleware/roleMiddleware");

// TODO: Create admin controllers
// For now, return placeholder responses

router.get("/bookings", authMid, roleMid.requireRole(["admin"]), (req, res) => {
    res.json({ message: "Admin bookings endpoint" });
});

router.get("/users", authMid, roleMid.requireRole(["admin"]), (req, res) => {
    res.json({ message: "Admin users endpoint" });
});

router.get("/logs", authMid, roleMid.requireRole(["admin"]), (req, res) => {
    res.json({ message: "Admin logs endpoint" });
});

router.get("/fraud-alerts", authMid, roleMid.requireRole(["admin"]), (req, res) => {
    res.json({ message: "Admin fraud alerts endpoint" });
});

module.exports = router;
