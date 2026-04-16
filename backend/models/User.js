const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["user", "admin", "station_master"],
        default: "user"
    },
    otp: String,
    otpExpiry: Number,
    isVerified: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);