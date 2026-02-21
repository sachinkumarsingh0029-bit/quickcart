const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./Models/auth/userSchema');

const createAdmin = async () => {
    try {
        // SAME connection as index.js
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");

        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("Admin already exists ❗");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("admin1234", 10);

        const admin = new User({
            username: "admin",
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            verificationStatus: true
        });

        await admin.save();
        console.log("Admin Created Successfully ✅");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createAdmin();