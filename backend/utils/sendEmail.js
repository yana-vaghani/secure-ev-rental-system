const nodemailer = require("nodemailer");

const sendEmail = async (email, payload) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const isOtpMode = typeof payload === "string" || typeof payload === "number";

    let mailOptions;

    if (isOtpMode) {
        const otp = payload;
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            html: `<div style="font-family:Arial,sans-serif;padding:16px"><h2>Secure EV Rental</h2><p>Your OTP is:</p><h1 style="letter-spacing:4px">${otp}</h1><p>This code expires in 5 minutes.</p></div>`
        };
    } else {
        const type = payload?.type || "generic";
        if (type === "review_request") {
            mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "How was your ride? Share your experience 🚗⚡",
                html: `<div style="font-family:Arial,sans-serif;padding:16px"><h2>Thanks for using Secure EV Rental!</h2><p>Your trip with <b>${payload.vehicleName || "our vehicle"}</b> is marked as completed.</p><p>We would love your review. Open the app and rate your experience so other users can benefit from your feedback.</p><p>Ride safe, and see you again!</p></div>`
            };
        } else {
            mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: payload?.subject || "Secure EV Rental Notification",
                html: payload?.html || "<p>Notification from Secure EV Rental.</p>"
            };
        }
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;