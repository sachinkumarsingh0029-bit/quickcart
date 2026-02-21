const Ip = require('../models/auth/ipSchema');
const moment = require('moment');

const ipBannedMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip;
        const existingIp = await Ip.findOne({ address: ip });

        if (existingIp) {
            if (existingIp.isBanned) {
                const banExpiresAt = moment(existingIp.banExpiresAt);
                const now = moment();
                if (existingIp.banExpiresAt < Date.now()) {
                    // Remove ban
                    await existingIp.delete();
                } else {
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    return res.status(419).json({
                        code: 419,
                        message: `IP address is banned for ${hours} hours`,
                        banExpiresAt: existingIp.banExpiresAt
                    });
                }
            }
        }
        next();
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            code: 419,
            message: "Internal Server Error",
        });
    }
};

module.exports = ipBannedMiddleware;
