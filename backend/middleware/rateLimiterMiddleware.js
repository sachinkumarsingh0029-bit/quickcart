const rateLimit = require("express-rate-limit");
const Ip = require('../models/auth/ipSchema.js');
const moment = require('moment');

const MIN_BAN_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_BAN_TIME = 30 * 60 * 1000; // 30 minutes

const rateLimitermiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000, // limit each IP to 30 requests per minute
    async keyGenerator(req, res) {
        // Use the client IP address as the key
        const clientIp = req.ip;
        const ip = await Ip.findOne({ address: clientIp });
        try {
            if (!ip) {
                await Ip.create({ address: clientIp });
                return;
            }
            if (ip.banExpiresAt < Date.now()) {
                req.ipBanned = { ip: clientIp, banned: false, banDuration: Date.now() };
                await Ip.remove({ address: clientIp });
                return;
            }
            if (ip && ip.isWhitelisted) {
                req.ipBanned = { ip: clientIp, banned: false };
            } else if (ip && ip.isBanned && ip.banExpiresAt > Date.now()) {
                const time = moment(ip.banExpiresAt).fromNow().replace(/^in\s+/, '');
                req.ipBanned = { ip: clientIp, banned: true, banDuration: time };
            }
            req.ipBanned = { ip: clientIp, banned: ip.isBanned, banDuration: ip.banExpiresAt };
        } catch (err) {
            throw new Error(`Error checking IP address: ${err.message}`);
        }
    },
    async handler(req, res, next) {
        // Ban the client for a random time between 10-30 minutes
        try {
            const remainingRequests = res.get('X-RateLimit-Remaining');
            if (req.ipBanned != undefined) {
                if (req.ipBanned.banned) {
                    const statusCode = 419;
                    const time = moment(req.ipBanned.banDuration).fromNow().replace(/^in\s+/, '');
                    const message = `Too many requests. Please try again later. IP address is banned for ${time}`;
                    res.status(statusCode).json({ status: 'error', code: statusCode, message, banExpiresAt: req.ipBanned.banDuration });
                    return;
                } else if (!req.ipBanned.banned && remainingRequests == 0) {
                    const clientIp = req.ip;
                    const banExpiresAt = Date.now() + Math.floor(Math.random() * (MAX_BAN_TIME - MIN_BAN_TIME + 1) + MIN_BAN_TIME);
                    const updatedIp = await Ip.updateOne(
                        { address: clientIp },
                        { isBanned: true, banExpiresAt },
                        { upsert: true, new: true }
                    );

                    const time = moment(banExpiresAt).fromNow().replace(/^in\s+/, '');
                    const statusCode = 419;
                    const message = `Too many requests. Please try again later. IP address is banned for ${time}`;
                    res.status(statusCode).json({ status: 'error', code: statusCode, message: message, banExpiresAt: banExpiresAt });
                    return;
                }
            }
        } catch (err) {
            throw new Error(`Error banning IP address: ${err.message}`);
        }
    },
});


module.exports = rateLimitermiddleware;
