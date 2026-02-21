const uuid = require('uuid');
const crypto = require('crypto');

// Middleware to assign unique identifier to user/browser in a cookie
const assignUniqueIdentity = (req, res, next) => {
    if (!req.cookies.uid) {
        // Combine user IP, user agent, and timestamp with UUID to create a more unique identifier
        const uniqueId = uuid.v4() + req.ip + req.headers['user-agent'] + Date.now();
        // Use a hashing function to create a fixed-length string from the combined values
        const hashedId = crypto.createHash('sha256').update(uniqueId).digest('hex');
        // Set the unique identifier in a cookie with a one year expiration time
        res.cookie('uid', hashedId, { maxAge: 31536000000, httpOnly: true });
        // Call the next middleware function
    }
    next();
}

module.exports = assignUniqueIdentity