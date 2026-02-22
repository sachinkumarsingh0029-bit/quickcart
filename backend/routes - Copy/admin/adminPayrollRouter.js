const express = require("express");
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

const WithdrawalRequest = require("../../models/payroll/withdrawalRequest");
const transactionSchema = require("../../models/transaction/transactionSchema");
const Payroll = require("../../models/payroll/payrollSchema");

const customLogger = require("../../utils/logHandler");

// Get all payrolls
router.get(
  "/payrolls/withdrawalrequests",
  [
    authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"]),
    checkVerificationMiddleware,
  ],
  async (req, res) => {
    try {
      const requests = await WithdrawalRequest.find({})
        .populate({ path: "seller", select: "businessUsername businessEmail" })
        .sort({ createdAt: -1 });
      res.status(200).json({ status: "success", requests: requests });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }
);

// transfer amount
router.post(
  "/payrolltransfer/withdrawalrequest/accept/:id",
  [
    authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"]),
    checkVerificationMiddleware,
  ],
  async (req, res) => {
    try {
      customLogger(
        req.user.role,
        `Transfer amount to seller - payroll - ${req.params.id}`,
        req
      );
      const request = await WithdrawalRequest.findById(req.params.id);
      if (!request) {
        return res
          .status(404)
          .json({ status: "error", message: "Request not found" });
      }
      if (request.status !== "Pending") {
        return res
          .status(499)
          .json({ status: "error", message: "Request already processed" });
      }
      const payroll = await Payroll.findOne({ seller: request.seller._id });
      if (!payroll) {
        return res.status(404).json({ error: "Payroll not found" });
      }

      request.status = "Approved";

      const newTransaction = new transactionSchema({
        seller: request.seller._id,
        type: "withdraw",
        amount: request.amount,
        status: "Completed",
        paymentMethod: "Bank",
      });

      await newTransaction.save();

      payroll.transactions.push({
        transaction: newTransaction._id,
      });

      await payroll.save();
      await request.save();

      res.status(200).json({ status: "success", message: "Request processed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }
);

module.exports = router;
