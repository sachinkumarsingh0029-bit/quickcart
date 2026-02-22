const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Withdrawal Request schema
const WithdrawalRequestSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }, // Reference to User schema
    bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        ifscCode: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: true, updatedAt: true }
});

const WithdrawalRequest = mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);

module.exports = WithdrawalRequest;
