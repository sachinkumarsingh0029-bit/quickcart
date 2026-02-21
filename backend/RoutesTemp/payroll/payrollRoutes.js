const express = require("express");
const router = express.Router();
const payrollController = require("../../controllers/payroll/payrollController");

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

// Get a payroll by ID
router.get("/", [
    authenticateMiddleware,
    authorizeMiddleware(["seller"]),
    checkVerificationMiddleware,
], payrollController.getPayroll);

// create withdrawal request
router.post("/", [
    authenticateMiddleware,
    authorizeMiddleware(["seller"]),
    checkVerificationMiddleware,
], payrollController.requestWithdrawal);

router.get('/withdrawal-requests', [
    authenticateMiddleware,
    authorizeMiddleware(["seller"]),
    checkVerificationMiddleware,
], payrollController.getWithdrawalRequests);

module.exports = router;
