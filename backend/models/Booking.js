const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleName: String,
    vehicleType: {
        type: String,
        enum: ["car", "bike"],
        default: "car"
    },
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
    distanceTravelledKm: {
        type: Number,
        default: 0
    },
    usageHours: {
        type: Number,
        default: 0
    },
    damageReported: {
        type: Boolean,
        default: false
    },
    damageNotes: String,
    isCompleted: {
        type: Boolean,
        default: false
    },
    returnedAt: Date,
    review: {
        rating: Number,
        comment: String,
        createdAt: Date
    },
    sharedOnPlatform: {
        type: Boolean,
        default: true
    },
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