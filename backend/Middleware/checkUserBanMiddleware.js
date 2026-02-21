const User = require('../models/auth/userSchema');
const moment = require('moment');
const handleError = require('../utils/errorHandler');

const checkBanMiddleware = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.banStatus.isBanned) {
            if (user.banStatus.banExpiresAt) {
                const banExpiresAt = moment(user.banStatus.banExpiresAt);
                const now = moment();
                if (user.banStatus.banExpiresAt < Date.now()) {
                    // Ban has expired, unban the user
                    user.banStatus.isBanned = false;
                    user.banStatus.banExpiresAt = null;
                    await user.save();
                } else {
                    // Ban is still in effect
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    if (user.tokens.length > 0) {
                        await user.updateOne({ $set: { tokens: [] } });
                    }
                    return res.status(417).json({ status: 'error', message: `You are banned from this service. Time until unban: ${hours} hours` });
                }
            } else {
                // Permanent ban
                // Delete all tokens from the user
                if (user.tokens.length > 0) {
                    await user.updateOne({ $set: { tokens: [] } });
                }
                return res.status(418).json({ status: 'error', message: `You are banned from this service permanently` });
            }
        }
        next();
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = checkBanMiddleware;
