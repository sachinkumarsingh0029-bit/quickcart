const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: { type: String, required: true, immutable: true },
    message: { type: String, required: true, immutable: true },
    timestamp: { type: Date, required: true, immutable: true },
    meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Log = mongoose.model('logs', logSchema);

module.exports = Log;
