const Booking = require("../models/Booking");

const checkFraud = async (userId) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentBookings = await Booking.find({
        userId,
        createdAt: { $gte: fiveMinutesAgo }
    });const Booking = require("../models/Booking");

const checkFraud = async (userId) => {
    const last5Min = new Date(Date.now() - 5 * 60 * 1000);

    const bookings = await Booking.find({
        userId,
        createdAt: { $gte: last5Min }
    });

    if (bookings.length >= 3) {
        return {
            fraud: true,
            reason: "Too many bookings in short time"
        };
    }

    return { fraud: false };
};

module.exports = checkFraud;

    if (recentBookings.length >= 3) {
        return true; // Fraud detected
    }

    return false;
};

module.exports = checkFraud;