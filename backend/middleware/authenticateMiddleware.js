const jwt = require('jsonwebtoken');
const User = require('../models/auth/userSchema');
const Seller = require('../models/seller/sellerSchema');

const authenticateMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized - No token' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(403).json({ status: 'error', message: 'User not found' });
        }

        req.user = user;

        if (user.role === 'seller') {
            const seller = await Seller.findOne({ user: user._id });

            if (!seller) {
                return res.status(403).json({ status: 'error', message: 'Seller not found' });
            }

            req.seller = seller;
        }

        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
};

module.exports = authenticateMiddleware;