const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const Ip = require('../../Models/auth/ipSchema');
const User = require('../../Models/auth/userSchema');
const { sendVerificationCode } = require('./verificationController');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const { default: mongoose } = require('mongoose');
const Seller = require('../../Models/seller/sellerSchema');
const generateCode = require('../../utils/generateCode');
const customLogger = require('../../utils/logHandler');

const generateVerificationCode = require('../../utils/generateCode');
const { v4: uuidv4 } = require('uuid');

exports.signup = async (req, res) => {
    customLogger("user", "signup", req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const ip = req.ip;
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

        user = new User({
            email,
            password,
            username
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const token = await user.generateAuthToken();

        await user.save().then(async () => {
            await sendVerificationCode(res, user.email);
        });

        const existingIp = await Ip.findOne({ address: ip });
        if (existingIp) {
            // If the IP is already in the database, increment the signup count
            existingIp.signupCount += 1;
            existingIp.lastSignupAt = Date.now();
            await existingIp.save();
        } else {
            // If the IP is not in the database, create a new IP document with the initial signup count
            const newIp = new Ip({
                address: ip,
                signupCount: 1,
                lastSignupAt: Date.now()
            });
            await newIp.save();
        }

        res.status(200).json({ status: 'success' });
    } catch (err) {
        customLogger("user", "signup", req)
        return handleError(res, err);
    }
};

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
            req.user = user;
            customLogger(req.user.role, `${user.role} login`, req)
            delete req.user;

            if (user.role === "seller") {
                const seller = await Seller.findById(user.seller);
                const verificationCode = generateCode();
                const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

                seller.loginCode = verificationCode;
                seller.loginCodeExpiresAt = codeExpiry;
                await seller.save();

                const data = {
                    subject: 'Seller Login - QuickCart',
                    username: seller.businessName,
                    verificationCode: seller.loginCode,
                    verificationLink: `http://localhost:3001/login/${seller.businessEmail}`
                };

                sendEmail(seller.businessEmail, data, './seller/loginVerification.hbs');

                // Set token in cookies
                res.cookie('token', token, {
                    httpOnly: true, // cookie cannot be accessed from client-side scripts
                    secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // cookie should only be sent for same-site requests
                    maxAge: 5 * 60 * 60 * 1000 // 5hr
                });

                return res.status(200).json({
                    role: "seller", message: "Please check your email address for login as seller.",
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
            } else {


                // Set token in cookies
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
};

exports.getUser = async (req, res) => {
    customLogger(req.user.role, "user deatils", req)
    try {
        const token = req.cookies.token;
        // Check if user is authenticated
        if (!token) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if user has permission to access this resource
        if (user._id.toString() !== decodedToken._id) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
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
            }, status: 'success',
        });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.updateProfile = async (req, res) => {
    customLogger(req.user.role, "update profile", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        const { username, name, email, number, address } = req.body;

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.number = number || user.number;
        user.address = address || user.address;

        await user.save();

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
            }, status: 'success',
        });

        const data = {
            userUpdated: {
                name: user.name,
                email: user.email
            },
            subject: 'Account Updated - QuickCart'
        };

        await sendEmail(user.email, data, './userActions/userAccountChange.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

exports.updatePassword = async (req, res) => {
    customLogger(req.user.role, "update password", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id);

        // Check if current password matches
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }

        // Generate salt and hash for new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;
        user.save()

        // Generate and save new auth token
        const token = await user.generateAuthToken();

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true, // cookie cannot be accessed from client-side scripts
            secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // cookie should only be sent for same-site requests
            maxAge: 5 * 60 * 60 * 1000 // 5hr
        });

        res.status(200).json({ message: 'Password updated successfully', status: 'success', });

        const data = {
            passwordUpdated: {
                name: user.username,
                email: user.email,
            },
            subject: 'Password Updated - QuickCart'
        };

        await sendEmail(user.email, data, './userActions/userAccountChange.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

exports.logout = async (req, res) => {
    customLogger(req.user.role, "user logout", req)
    try {
        res.clearCookie('token');
        const user = await User.findById(req.user._id);
        user.tokens = [];
        await user.save();
        res.status(200).json({ message: 'Logged out successfully', status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.deleteAccount = async (req, res) => {
    customLogger(req.user.role, "user account delete", req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        const token = req.cookies.token;
        const { password } = req.body;
        console.log(req.body)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decodedToken._id,
            'tokens.token': token,
            'tokens.expiresAt': { $gte: Date.now() }
        });

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(499).json({
                status: 'error',
                message: 'Invalid Credentials'
            });
        }

        await user.remove();

        const data = {
            userDeleted: {
                code: user.name,
                email: user.email,
                deletedAt: new Date()
            },
            subject: 'Account Deleted - QuickCart'
        };
        res.clearCookie('token');
        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });

        await sendEmail(user.email, data, './userActions/userAccountChange.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findOne({ email: req.body.email });

        // For security, always return success even if user doesn't exist (prevents email enumeration)
        // But only proceed with reset code if user exists
        if (!user) {
            customLogger("unknown", "forgot password - user not found", req);
            return res.status(200).json({
                status: 'success',
                message: 'If an account with that email exists, a reset password code has been sent'
            });
        }

        customLogger(user.role, "forgot password", req);

        const uuid = uuidv4();

        const resetPasswordCode = `resetpassword_${user._id}_${uuid}_${Date.now()}`;
        const resetPasswordCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordCodeExpiresAt = resetPasswordCodeExpiry;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Reset password code sent successfully'
        });

        const data = {
            username: user.username,
            resetPasswordCode: resetPasswordCode,
            subject: 'Reset Password - QuickCart'
        };

        await sendEmail(user.email, data, './userActions/forgotPassword.hbs');

    } catch (err) {
        console.log(err)
        return handleError(res, err);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const parts = req.body.resetToken.split('_'); // Split the string by underscores

        const userId = parts[1];

        const user = await User.findById(userId);

        if (user.resetPasswordCodeExpiresAt > Date.now() && user.resetPasswordCode !== null) {
            customLogger(user.role, "forgot password", req)

            // Generate salt and hash for new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

            user.password = hashedPassword;
            user.resetPasswordCode = null;
            user.resetPasswordCodeExpiresAt = null;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully', status: 'success', });

            const data = {
                passwordUpdated: {
                    name: user.username,
                    email: user.email,
                },
                subject: 'Password Updated - QuickCart'
            };

            await sendEmail(user.email, data, './userActions/userAccountChange.hbs');
        } else {
            res.status(499).json({ status: "error", message: 'The reset password code has expired.' })

            user.resetPasswordCode = null;
            user.resetPasswordCodeExpiresAt = null;
            await user.save();
        }
    } catch (err) {
        return handleError(res, err);
    }
}