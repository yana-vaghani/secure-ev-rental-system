const Booking = require("../models/Booking");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

exports.getOverview = async (req, res) => {
    try {
        const [totalUsers, totalBookings, pendingApprovals, flaggedAccounts, damageReports, bookings] = await Promise.all([
            User.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" }),
            Booking.countDocuments({ status: "flagged" }),
            Booking.countDocuments({ damageReported: true }),
            Booking.find({}, "usageHours distanceTravelledKm")
        ]);

        const totalUsageHours = bookings.reduce((sum, b) => sum + (b.usageHours || 0), 0);
        const totalDistanceKm = bookings.reduce((sum, b) => sum + (b.distanceTravelledKm || 0), 0);

        res.json({
            totalUsers,
            totalBookings,
            pendingApprovals,
            flaggedAccounts,
            damageReports,
            totalUsageHours: Number(totalUsageHours.toFixed(2)),
            totalDistanceKm: Number(totalDistanceKm.toFixed(2))
        });
    } catch (err) {
        console.error("ADMIN OVERVIEW ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const [fraudAlerts, damageAlerts] = await Promise.all([
            Booking.find({ status: "flagged" }).populate("userId", "name email").sort({ createdAt: -1 }).limit(20),
            Booking.find({ damageReported: true }).populate("userId", "name email").sort({ updatedAt: -1 }).limit(20)
        ]);

        res.json({ fraudAlerts, damageAlerts });
    } catch (err) {
        console.error("ADMIN ALERTS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const bookings = await Booking.find(filter).populate("userId", "name email").sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("ADMIN BOOKINGS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(200).populate("userId", "name email role");
        res.json(logs);
    } catch (err) {
        console.error("ADMIN LOGS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
