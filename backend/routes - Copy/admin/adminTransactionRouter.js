const express = require('express');
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const transactionSchema = require('../../models/transaction/transactionSchema');

// Get all transactions by customer
router.get('/transactions', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const transactions = await transactionSchema.find({ customer: { $exists: true } }).populate({
            path: 'customer',
            select: 'username'
        }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', transactions: transactions });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get All transaction by seller
router.get('/sellertransactions', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const transactions = await transactionSchema.find({ seller: { $exists: true } }).populate({
            path: 'seller',
            select: 'businessUsername'
        }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', transactions: transactions });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
