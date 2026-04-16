const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Check if test user already exists
        const existingUser = await User.findOne({ email: "test@example.com" });
        if (existingUser) {
            console.log("Test user already exists!");
            await mongoose.connection.close();
            return;
        }

        // Create hashed password
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create test user
        const testUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword,
            role: "user",
            isVerified: true
        });

        await testUser.save();
        console.log("✅ Test user created!");
        console.log("Email: test@example.com");
        console.log("Password: password123");

        await mongoose.connection.close();
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seedDatabase();
