const Booking = require("../models/Booking");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const checkFraud = async (userId) => {
    const recentBookings = await Booking.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
    });
    return recentBookings.length >= 3;
};

exports.createBooking = async (req, res) => {
    try {
        const { vehicleName, vehicleType, station, startTime, endTime } = req.body;

        if (!vehicleName || !station || !startTime || !endTime) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const isFraud = await checkFraud(req.user.id);
        const status = isFraud ? "flagged" : "pending";

        const booking = await Booking.create({
            userId: req.user.id,
            vehicleName,
            vehicleType: vehicleType || "car",
            station,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status,
            flaggedReason: isFraud ? "3+ bookings within 10 minutes" : undefined
        });

        await ActivityLog.create({
            userId: req.user.id,
            action: isFraud ? "FRAUD_FLAGGED" : "BOOKING_CREATED",
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
        booking.updatedAt = new Date();
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

exports.completeBooking = async (req, res) => {
    try {
        const { distanceTravelledKm = 0, damageReported = false, damageNotes = "" } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to complete this booking" });
        }

        const returnedAt = new Date();
        const usageHours = Math.max(0, (returnedAt.getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60));

        booking.isCompleted = true;
        booking.returnedAt = returnedAt;
        booking.distanceTravelledKm = Number(distanceTravelledKm) || 0;
        booking.usageHours = Number(usageHours.toFixed(2));
        booking.damageReported = Boolean(damageReported);
        booking.damageNotes = damageNotes;
        booking.updatedAt = new Date();
        await booking.save();

        const user = await User.findById(req.user.id);
        if (user?.email) {
            await sendEmail(user.email, {
                type: "review_request",
                vehicleName: booking.vehicleName
            });
        }

        res.json({ message: "Booking returned. Review request sent via email.", booking });
    } catch (err) {
        console.error("COMPLETE BOOKING ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.submitReview = async (req, res) => {
    try {
        const { rating, comment, sharedOnPlatform = true } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to review this booking" });
        }
        if (!booking.isCompleted) {
            return res.status(400).json({ message: "Complete your trip before posting a review" });
        }

        booking.review = {
            rating: Number(rating),
            comment: comment || "",
            createdAt: new Date()
        };
        booking.sharedOnPlatform = Boolean(sharedOnPlatform);
        booking.updatedAt = new Date();
        await booking.save();

        res.json({ message: "Review submitted successfully", booking });
    } catch (err) {
        console.error("SUBMIT REVIEW ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getPublicReviews = async (req, res) => {
    try {
        const reviews = await Booking.find({
            "review.rating": { $exists: true },
            sharedOnPlatform: true
        })
            .populate("userId", "name")
            .sort({ "review.createdAt": -1 })
            .limit(50);

        res.json(
            reviews.map((booking) => ({
                id: booking._id,
                userName: booking.userId?.name || "Anonymous",
                vehicleName: booking.vehicleName,
                rating: booking.review?.rating,
                comment: booking.review?.comment,
                createdAt: booking.review?.createdAt
            }))
        );
    } catch (err) {
        console.error("PUBLIC REVIEWS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const { distanceKm = 0, passengers = 1, withFamily = false } = req.body;

        const fleet = [
            { model: "Ather 450X", type: "bike", seats: 2, idealKm: 70, reason: "Great for short city trips" },
            { model: "TVS iQube", type: "bike", seats: 2, idealKm: 90, reason: "Comfortable and efficient for daily rides" },
            { model: "Tata Tiago EV", type: "car", seats: 5, idealKm: 220, reason: "Budget family car for medium trips" },
            { model: "MG ZS EV", type: "car", seats: 5, idealKm: 320, reason: "Best for long range and comfort" }
        ];

        const recommended = fleet
            .filter((item) => item.seats >= Number(passengers))
            .map((item) => ({
                ...item,
                score: Math.abs(item.idealKm - Number(distanceKm)) + (withFamily && item.type === "car" ? -30 : 0)
            }))
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);

        res.json({ recommended });
    } catch (err) {
        console.error("RECOMMENDATION ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.chatbotSupport = async (req, res) => {
    try {
        const message = String(req.body.message || "").toLowerCase();
        let reply = "I can help with booking status, cancellations, OTP issues, recommendations, and damage reporting.";

        if (message.includes("otp")) {
            reply = "If OTP is not received, check spam folder, then try login again to regenerate OTP. OTP expires in 5 minutes.";
        } else if (message.includes("cancel")) {
            reply = "Go to your bookings and click cancel on pending/approved booking. If already rejected/cancelled, it cannot be cancelled again.";
        } else if (message.includes("approve") || message.includes("pending")) {
            reply = "Pending bookings are reviewed by admin/station manager. You will see status updates in your dashboard.";
        } else if (message.includes("damage")) {
            reply = "At return time, mark damage details in the return form so support can assist quickly.";
        } else if (message.includes("recommend")) {
            reply = "Use trip recommendation: enter distance, passengers, and family preference to get best EV options.";
        }

        res.json({ reply });
    } catch (err) {
        console.error("CHATBOT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

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

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, reason } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be approved or rejected" });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status,
                ...(status === "rejected" && { rejectReason: reason }),
                updatedAt: new Date()
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
