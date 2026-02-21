const express = require("express");

const adminProductRouter = require("./adminProductRouter");
const adminSellerRouter = require("./adminSellerRouter");
const adminUserRouter = require("./adminUserRouter");
const adminTransactionRouter = require("./adminTransactionRouter");
const adminTicketRouter = require("./adminTicketRouter");
const adminOrderRouter = require("./adminOrderRouter");
const adminPayrollRouter = require("./adminPayrollRouter");
const adminLogsRouter = require("./adminLogsRouter");
const adminStatsRouter = require("./adminStatsRouter");

const { check, validationResult } = require("express-validator");
const handleError = require("../../utils/errorHandler");
const User = require("../../Models/auth/userSchema");
const customLogger = require("../../utils/logHandler");

const router = express.Router();

// login as admin
router.post("/login", [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        User.findByCredentials(email, password).then(async ({ token, user }) => {

            if (!user) {
                return handleError(res, {
                    message: 'Invalid Credentials',
                    status: 401,
                    code: 'authentication_failed'
                });
            }

            if (user.role === "admin" || user.role === "superadmin" || user.role === "root") {
                res.cookie('token', token, {
                    httpOnly: true, // cookie cannot be accessed from client-side scripts
                    secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // cookie should only be sent for same-site requests
                    maxAge: 5 * 60 * 60 * 1000 // 5hr
                });

                res.status(200).json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        address: user.address,
                        verificationStatus: user.verificationStatus,
                        role: user.role,
                        number: user.number
                    },
                    status: 'success'
                });

                req.user = user
                customLogger(user.role, "login", req)
                delete req.user;

            } else {
                return handleError(res, {
                    message: 'Invalid Credentials',
                    status: 401,
                    code: 'authentication_failed'
                });
            }
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        return handleError(res, {
            message: 'Invalid Credentials',
            status: 401,
            code: 'authentication_failed'
        });
    }
});

router.use('/product', adminProductRouter);
router.use('/seller', adminSellerRouter);
router.use('/user', adminUserRouter);
router.use('/transaction', adminTransactionRouter);
router.use('/ticket', adminTicketRouter);
router.use('/order', adminOrderRouter);
router.use('/payroll', adminPayrollRouter);
router.use('/logs', adminLogsRouter);
router.use('/stats', adminStatsRouter);

module.exports = router;
