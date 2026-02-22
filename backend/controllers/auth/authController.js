const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const Ip = require('../../models/auth/ipSchema');
const User = require('../../models/auth/userSchema');
const { sendVerificationCode } = require('./verificationController');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const Seller = require('../../models/seller/sellerSchema');
const generateCode = require('../../utils/generateCode');
const customLogger = require('../../utils/logHandler');
const { v4: uuidv4 } = require('uuid');

/* ===============================
   COOKIE OPTIONS (🔥 FIXED)
================================= */

const cookieOptions = {
    httpOnly: true,
    secure: true,          // required for sameSite none
    sameSite: "none",      // REQUIRED for cross-domain (Vercel → Render)
    maxAge: 5 * 60 * 60 * 1000
};

/* ===============================
   SIGNUP
================================= */

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const { email, password, username } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'User already exists',
            });
        }

        user = new User({ email, password, username });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        await sendVerificationCode(res, user.email);

        res.status(200).json({ status: 'success' });

    } catch (err) {
        return handleError(res, err);
    }
};

/* ===============================
   LOGIN (🔥 FIXED COOKIE)
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
        const { token, user } = await User.findByCredentials(email, password);

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

    } catch (err) {
        return handleError(res, {
            message: 'Invalid Credentials',
            status: 401,
            code: 'authentication_failed'
        });
    }
};

/* ===============================
   GET USER
================================= */

exports.getUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

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

    } catch (err) {
        return handleError(res, err);
    }
};

/* ===============================
   UPDATE PASSWORD (🔥 FIXED COOKIE)
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
   LOGOUT (🔥 FIXED)
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