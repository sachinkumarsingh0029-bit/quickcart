const express = require('express');
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const transactionSchema = require('../../Models/transaction/transactionSchema');
const RefundRequest = require('../../Models/transaction/refundRequestSchema');
const orderSchema = require('../../Models/order/orderSchema');
const sendEmail = require('../../utils/sendEmail');

const customLogger = require('../../utils/logHandler')

// refund requests
router.get("/refundrequests", authenticateMiddleware, checkVerificationMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), async (req, res) => {
    try {
        const refunds = await RefundRequest.find({ status: "Seller Received Products" });
        res.status(200).json({
            refunds: refunds || [],
            status: "success"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error",
            status: "failure"
        });
    }
});

// refund request by id
router.get("/refundrequest/:refundId", authenticateMiddleware, checkVerificationMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), async (req, res) => {
    try {
        const refund = await RefundRequest.findOne({ _id: req.params.refundId, status: "Seller Received Products" }).populate(['orderId', 'transactionId']).populate({
            path: 'customer',
            select: '-password -tokens -tickets -tokens'
        });

        if (!refund) {
            return res.status(404).json({
                message: "Refund Request Not Found",
                status: "error"
            });
        }

        res.status(200).json({
            refund: refund,
            status: "success"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error",
            status: "failure"
        });
    }
});

// refund amount
router.post("/approve-refund/:refundId", authenticateMiddleware, checkVerificationMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), async (req, res) => {
    try {
        customLogger(req.user.role, `Refund amount approved - ${req.params.refundId}`, req)
        const refund = await RefundRequest.findOne({ _id: req.params.refundId, status: "Seller Received Products" }).populate('customer');

        if (!refund) {
            return res.status(404).json({
                message: "Refund Request Not Found",
                status: "error"
            });
        }

        const transaction = await transactionSchema.findOne({ _id: refund.transactionId });
        const refundAmount = (transaction.amount - transaction.refundedAmount) - refund.amount;

        if (refundAmount === 0) {
            transaction.status = "Refunded";
            transaction.refundReason = refund.reason
            transaction.refundedAmount = transaction.amount
        } else {
            transaction.status = "Partially Refunded";
            transaction.refundReason = refund.reason;
            transaction.refundedAmount = refund.amount;
        }

        transaction.save();
        refund.status = "Refunded";
        refund.save();
        const order = await orderSchema.findOne({ _id: refund.orderId });
        order.orderStatus = "Returned";
        order.save();

        res.status(200).json({
            message: "Transfered Successfully",
            status: "success"
        });

        const data = {
            username: refund.customer.username,
            amount: refund.amount,
            adminUsername: req.user.username,
            subject: 'Refund Confirmation - QuickCart'
        };

        await sendEmail(refund.customer.email, data, './order/moneyRefunded.hbs');

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error",
            status: "failure"
        });
    }
});


module.exports = router;
