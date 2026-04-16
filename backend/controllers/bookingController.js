const Booking = require("../models/Booking");
const ActivityLog = require("../models/ActivityLog");

// Check for fraud (multiple bookings in short time)
const checkFraud = async (userId) => {
    const recentBookings = await Booking.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }  // Last 10 minutes
    });
    return recentBookings.length >= 3;
};

exports.createBooking = async (req, res) => {
    try {
        const { vehicleName, station, startTime, endTime } = req.body;

        if (!vehicleName || !station || !startTime || !endTime) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        // Check for fraud
        const isFraud = await checkFraud(req.user.id);
        const status = isFraud ? "flagged" : "pending";

        if (isFraud) {
            console.log(`🚨 Fraud detected for user ${req.user.id}`);
        }

        const booking = await Booking.create({
            userId: req.user.id,
            vehicleName,
            station,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status
        });

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: "BOOKING_CREATED",
            metadata: { bookingId: booking._id }
        });

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (err) {
        console.error("CREATE BOOKING ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("GET BOOKINGS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" });
        }

        if (booking.status !== "pending" && booking.status !== "approved") {
            return res.status(400).json({ message: "Only pending/approved bookings can be cancelled" });
        }

        booking.status = "cancelled";
        await booking.save();

        await ActivityLog.create({
            userId: req.user.id,
            action: "BOOKING_CANCELLED",
            metadata: { bookingId: booking._id }
        });

        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("CANCEL BOOKING ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const bookings = await Booking.find(filter)
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("GET ALL BOOKINGS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Admin: Approve/Reject booking
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, reason } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status,
                ...(status === "rejected" && { rejectReason: reason })
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await ActivityLog.create({
            userId: req.user.id,
            action: status === "approved" ? "BOOKING_APPROVED" : "BOOKING_REJECTED",
            metadata: { bookingId: booking._id, reason }
        });

        res.json({ message: `Booking ${status}`, booking });
    } catch (err) {
        console.error("UPDATE BOOKING ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};