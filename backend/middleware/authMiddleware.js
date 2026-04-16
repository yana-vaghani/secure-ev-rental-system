const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.header("Authorization");

        // ❌ No header
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // ❌ Wrong format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // ✅ Extract token
        const token = authHeader.split(" ")[1];

        // ❌ Empty token
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info
        req.user = decoded;

        next();
    } catch (err) {
        console.log("TOKEN ERROR:", err.message);

        return res.status(401).json({ message: "Invalid or expired token" });
    }
};