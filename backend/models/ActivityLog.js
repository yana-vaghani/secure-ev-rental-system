const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    action: {
        type: String,
        enum: [
            "LOGIN",
            "LOGOUT",
            "REGISTER",
            "OTP_REQUEST",
            "OTP_VERIFIED",
            "BOOKING_CREATED",
            "BOOKING_APPROVED",
            "BOOKING_REJECTED",
            "BOOKING_CANCELLED",
            "ROLE_CHANGED",
            "ACCOUNT_SUSPENDED",
            "FRAUD_FLAGGED"
        ]
    },
    ip: String,
    userAgent: String,
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
