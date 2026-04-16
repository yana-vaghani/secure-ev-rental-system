const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleName: String,
    station: String,
    startTime: Date,
    endTime: Date,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled", "flagged"],
        default: "pending"
    },
    rejectReason: String,
    flaggedReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);