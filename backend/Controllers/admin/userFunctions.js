const { validationResult } = require('express-validator');

const User = require('../../Models/auth/userSchema');
const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');

const bcrypt = require('bcrypt');
const customLogger = require('../../utils/logHandler');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const usersAndSellers = await User.find({ role: { $in: ['user', 'seller'] } });
        res.status(200).json({ status: 'success', message: 'Users retrieved successfully', users: usersAndSellers });
    } catch (err) {
        return handleError(res, err);
    }
};

const getAllTicketMasters = async (req, res) => {
    try {
        const ticketMasters = await User.find({ role: { $in: ['ticketmaster'] } });
        res.status(200).json({ status: 'success', message: 'Ticket Masters retrieved successfully', ticketmasters: ticketMasters });
    } catch (err) {
        return handleError(res, err);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -tokens -orders -tickets').lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const result = authorizeChangeMiddleware(user.role, req, res);
        if (result === -1) {
            return;
        }
        res.status(200).json({ status: 'success', user: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create new user
const createUser = async (req, res) => {
    customLogger(req.user.role, "create user", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'User already exists',
            });
        }

        const result = authorizeChangeMiddleware("user", req, res);
        if (result === -1) {
            return;
        }

        // Create new user
        user = new User({ username, email, password });

        // Hash password and save user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const data = {
            newUser: {
                name: user.username,
                email: user.email,
                role: user.role,
                password: password
            },
            adminUsername: req.user.username,
            subject: 'New user Account - QuickCart'
        };

        res.status(200).json({ status: 'success' });

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

        // Generate JWT token and send response
        await user.generateAuthToken();

    } catch (err) {
        return handleError(res, err);
    }
};

// update user
const updateUser = async (req, res) => {
    customLogger(req.user.role, "update user", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        const { id } = req.params;

        // check if user exists
        const user = await User.findById(id);
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        const result = authorizeChangeMiddleware(user.role, req, res);
        if (result === -1) {
            return;
        }

        // update user information
        const { username, name, email, number, address } = req.body;

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.number = number || user.number;
        user.address = address || user.address;
        await user.save();

        res.status(200).json({ status: 'success', message: 'User updated successfully', data: user });

        const data = {
            userUpdated: {
                name: user.username,
                email: user.email,
                role: user.role
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.username,
            },
            subject: 'User details updated - QuickCart'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

// update role
const updateRole = async (req, res) => {
    customLogger(req.user.role, "update role", req)
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }
        if (user.role === "seller") {
            return res.status(499).json({
                status: 'error',
                message: 'You cannot change the role of a seller'
            })
        }
        if (role === "seller") {
            return res.status(499).json({
                status: 'error',
                message: 'You cannot change the role to a seller'
            })
        }
        const result = authorizeChangeMiddleware(user.role, req, res);
        if (result === -1) {
            return;
        }
        user.role = role;
        await user.save();
        res.status(200).json({ status: 'success', message: 'User role updated successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

// delete user
const deleteUser = async (req, res) => {
    customLogger(req.user.role, "delete user", req)
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        console.log(user)
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        const result = authorizeChangeMiddleware(user.role, req, res);
        if (result === -1) {
            return;
        }
        await user.delete();
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });

        const data = {
            userDeleted: {
                name: user.username,
                email: user.email,
                role: user.role
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'User account deleted - QuickCart'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

// ban user
const banUser = async (req, res) => {
    customLogger(req.user.role, "ban user", req)
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        const result = authorizeChangeMiddleware(user.role, req, res);
        if (result === -1) {
            return;
        }
        
        user.banStatus.isBanned = true;
        user.banStatus.banExpiresAt = req.body.expiresAt;
        user.tokens = [];
        await user.save();

        res.status(200).json({ status: 'success', message: 'User has been banned successfully' });

        const data = {
            userBanned: {
                name: user.username,
                email: user.email,
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'Account banned - QuickCart'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { getAllTicketMasters, updateRole, getUserById, getAllUsers, createUser, updateUser, deleteUser, banUser };