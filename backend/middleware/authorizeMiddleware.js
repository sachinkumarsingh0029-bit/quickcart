const authorizeMiddleware = (roles) => async (req, res, next) => {
    try {
        // Check if there is an Authorization header in the request
        const token = req.cookies.token;
        if (!token) {
            throw new Error('Authorization header missing or invalid');
        }

        if (!req.user) {
            return res.status(415).send({ error: 'Invalid or expired token' });
        }

        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role]; // If the user's role is not an array, convert it to an array
        const authorized = userRoles.some((r) => roles.includes(r)); // Check if any of the user's roles match any of the roles in the list
        if (!authorized) {
            return res.status(416).send({ error: 'User not authorized to access this resource' });
        }

        next();
    } catch (err) {
        return res.status(415).send({ error: 'Invalid or expired token' });
    }
};

module.exports = authorizeMiddleware;
