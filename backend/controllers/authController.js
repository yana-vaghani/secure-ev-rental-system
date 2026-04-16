const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// LOGIN + OTP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json("Wrong password");

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`📧 OTP for ${email}: ${otp}`);

        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        try {
            await sendEmail(user.email, otp);
            console.log(`✅ OTP email sent to ${email}`);
            res.json("OTP sent to email");
        } catch (emailErr) {
            console.warn(`⚠️ Email send failed for ${email}: ${emailErr.message}`);
            // For development: return OTP in response if email fails
            res.json({ message: "OTP generated (email delivery failed)", otp });
        }
    } catch (err) {
        console.error("❌ LOGIN ERROR:", err);
        res.status(500).json(err.message);
    }
};
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`🔐 OTP verify attempt - Email: ${email}, Submitted: ${otp}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`⚠️ User not found: ${email}`);
            return res.status(400).json("User not found");
        }

        if (!user.otp) {
            console.warn(`⚠️ OTP not generated for ${email}`);
            return res.status(400).json("OTP not generated");
        }

        const otpMatch = user.otp.toString() === otp.toString();
        const otpExpired = user.otpExpiry < Date.now();

        console.log(`📋 Stored OTP: ${user.otp}, Match: ${otpMatch}, Expired: ${otpExpired}`);

        if (!otpMatch) {
            console.warn(`❌ OTP mismatch for ${email}`);
            return res.status(400).json("Invalid OTP");
        }

        if (otpExpired) {
            console.warn(`⏰ OTP expired for ${email}`);
            return res.status(400).json("OTP expired");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        console.log(`✅ OTP verified successfully for ${email}`);
        res.json({ token });

    } catch (err) {
        console.error("❌ VERIFY OTP ERROR:", err);
        res.status(500).json(err.message);
    }
};
// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json("User registered successfully");
    } catch (err) {
        res.status(500).json(err);
    }
};