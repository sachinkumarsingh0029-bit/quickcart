const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    address: { type: String, unique: true },
    isWhitelisted: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    banExpiresAt: { type: Date },
    signupCount: { type: Number, default: 0 },
    lastSignupAt: { type: Date },
});

const Ip = mongoose.model('Ip', ipSchema);

module.exports = Ip