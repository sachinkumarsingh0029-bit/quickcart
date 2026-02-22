const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const Ip = require('../../models/auth/ipSchema');
const User = require('../../models/auth/userSchema');
const { sendVerificationCode } = require('./verificationController');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const { default: mongoose } = require('mongoose');
const Seller = require('../../models/seller/sellerSchema');
const generateCode = require('../../utils/generateCode');
const customLogger = require('../../utils/logHandler');
const { v4: uuidv4 } = require('uuid');

/* ===================================
   🔥 FIXED COOKIE OPTIONS
=================================== */

const cookieOptions = {
    httpOnly: true,
    secure: true,        // required for sameSite none
    sameSite: "none",    // REQUIRED for Vercel → Render
    maxAge: 5 * 60 * 60 * 1000
};

/* ===============================
   LOGIN (ONLY COOKIE CHANGED)
================================= */

exports.login = async (req, res) => {
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

            // 🔥 FIXED COOKIE
            res.cookie('token', token, cookieOptions);

            return res.status(200).json({
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
};

/* ===============================
   UPDATE PASSWORD (COOKIE FIXED)
================================= */

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save();

        const token = await user.generateAuthToken();

        // 🔥 FIXED COOKIE
        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'Password updated successfully',
            status: 'success'
        });

    } catch (err) {
        return handleError(res, err);
    }
};

/* ===============================
   LOGOUT (COOKIE FIXED)
================================= */

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);

        res.status(200).json({
            message: 'Logged out successfully',
            status: 'success'
        });

    } catch (err) {
        return handleError(res, err);
    }
};