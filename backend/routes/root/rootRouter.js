const express = require('express');

const router = express.Router();

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const checkVerificationMiddleware = require('../../middleware/checkVerificationMiddleware');
const User = require('../../models/auth/userSchema');


// Get all transactions by customer
router.get('/superadmins', [authenticateMiddleware, authorizeMiddleware(["root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const superadmins = await User.find({ role: 'superadmin' });
        return res.status(200).json({ superadmins: superadmins, status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
});

module.exports = router;