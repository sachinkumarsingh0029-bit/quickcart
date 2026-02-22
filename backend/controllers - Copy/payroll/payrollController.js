const { parse } = require("uuid");
const Order = require("../../models/order/orderSchema");
const Payroll = require("../../models/payroll/payrollSchema");
const WithdrawalRequest = require("../../models/payroll/withdrawalRequest");

const customLogger = require("../../utils/logHandler");

// Get a payroll by ID
const getPayroll = async (req, res) => {
    try {
        let payroll = await Payroll.findOne({ seller: req.seller._id });
        if (!payroll) {
            payroll = new Payroll({ seller: req.seller._id, role: 'seller' });
        }

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        await Order.updateMany({
            createdAt: { $lt: oneWeekAgo },
            orderStatus: 'Delivered'
        },
            { orderStatus: 'Completed' });

        const completedOrders = await Order.find({ orderStatus: 'Completed', seller: req.seller._id });
        const completedOrdersTotal = completedOrders.reduce((total, order) => total + order.orderTotal, 0);

        payroll.amount = completedOrdersTotal;

        await payroll.save();

        res.status(200).json({ success: "success", amount: payroll.amount, availableAmount: payroll.amount - payroll.paidAmount });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: "error", error: err.message });
    }
};

// Request Withdrawal
const requestWithdrawal = async (req, res) => {
    try {
        customLogger("seller", "Request Withdrawal", req)
        let payroll = await Payroll.findOne({ seller: req.seller._id });
        if (payroll.amount > 0 && payroll.amount > payroll.paidAmount && (req.body.amount <= payroll.amount - payroll.paidAmount)) {
            payroll.paidAmount += parseInt(req.body.amount);
            payroll.save();
            const withdrawalRequest = new WithdrawalRequest({
                seller: req.seller._id,
                bankDetails: {
                    accountHolderName: req.body.accountHolderName,
                    bankName: req.body.bankName,
                    accountNumber: req.body.accountNumber,
                    ifscCode: req.body.ifscCode
                },
                amount: parseInt(req.body.amount)
            });
            await withdrawalRequest.save();
            res.status(200).json({ success: true, message: "The request to withdraw funds has been successfully initiated.", amount: payroll.amount });
        } else {
            res.status(499).json({ success: "error", message: 'Insufficient balance' });
        }
    } catch (err) {
        res.status(500).json({ success: "error", error: "Something went wrong..." });
    }
};

const getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await WithdrawalRequest.find({ seller: req.seller._id });
        res.status(200).json({ status: 200, requests: withdrawalRequests });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPayroll,
    requestWithdrawal,
    getWithdrawalRequests
};