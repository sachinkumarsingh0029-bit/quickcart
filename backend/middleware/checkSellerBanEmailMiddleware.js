const Seller = require('../models/seller/sellerSchema');
const moment = require('moment');
const handleError = require('../utils/errorHandler');

const checkSellerBanMiddleware = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ businessEmail: req.body.email });
        if (seller && seller.banStatus.isBanned) {
            if (seller.banStatus.banExpiresAt) {
                const banExpiresAt = moment(seller.banStatus.banExpiresAt);
                const now = moment();
                if (seller.banStatus.banExpiresAt < Date.now()) {
                    // Ban has expired, unban the user
                    seller.banStatus.isBanned = false;
                    seller.banStatus.banExpiresAt = null;
                    await seller.save();
                    next();
                } else {
                    // Ban is still in effect
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    seller.loginCode = "";
                    seller.loginCodeExpiresAt = "";
                    await seller.save();
                    return res.status(417).json({ status: 'error', message: `You are banned from this service. Time until unban: ${hours} hours` });
                }
            } else {
                // Permanent ban
                // Delete all tokens from the user
                return res.status(418).json({ status: 'error', message: `You are banned from this service permanently` });
            }
        }
        next();
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = checkSellerBanMiddleware;
