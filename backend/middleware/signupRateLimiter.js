const Ip = require('../models/auth/ipSchema');
const moment = require('moment');

const MAX_SIGNUPS_PER_DAY = 1;
const BAN_DURATION = 1 * 60 * 1000; // 7 days in milliseconds

const signupRateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const existingIp = await Ip.findOne({ address: ip });

        if (existingIp) {
            if (existingIp.isWhitelisted) {
                return null;
            } else if (existingIp.isBanned) {
                const banExpiresAt = moment(existingIp.banExpiresAt);
                const now = moment();
                const duration = moment.duration(banExpiresAt.diff(now));
                const hours = duration.asHours().toFixed(2);
                throw new Error(`IP address is banned for ${hours} hours`);
            } else if (existingIp.signupCount >= MAX_SIGNUPS_PER_DAY) {
                const banExpiresAt = new Date(Date.now() + BAN_DURATION);
                existingIp.isBanned = true;
                existingIp.isWhitelisted = false;
                existingIp.banExpiresAt = banExpiresAt;
                await existingIp.save();
                throw new Error(`IP address is banned for 7 days`);
            }
        }

        if (!existingIp) {
            const newIp = new Ip({
                address: ip,
                signupCount: 1,
                lastSignupAt: Date.now(),
            });
            await newIp.save();
        } else {
            existingIp.signupCount += 1;
            if (Date.now() - existingIp.lastSignupAt > 24 * 60 * 60 * 1000) {
                existingIp.signupCount = 1;
                existingIp.lastSignupAt = Date.now();
                next();
            }
            existingIp.lastSignupAt = Date.now();
            await existingIp.save();
            if (existingIp.signupCount >= MAX_SIGNUPS_PER_DAY) {
                const banExpiresAt = new Date(Date.now() + BAN_DURATION);
                existingIp.isBanned = true;
                existingIp.isWhitelisted = false;
                existingIp.banExpiresAt = banExpiresAt;
                await existingIp.save();
                throw new Error(`IP address is banned for 7 days`);
            }
        }

        next();
    } catch (err) {
        res.status(419).send({
            code: 419,
            message: err.message || "Internal Server Error",
        });
    }
};


module.exports = signupRateLimiter;
