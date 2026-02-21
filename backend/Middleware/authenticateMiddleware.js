const jwt = require('jsonwebtoken');
const User = require('../Models/auth/userSchema');
const Seller = require('../Models/seller/sellerSchema');

const authenticateMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log('Auth check - Token present:', !!token);
            console.log('Auth check - Cookies:', Object.keys(req.cookies));
        }
        
        // Check if not token
        if (!token) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized Access - No token' });
        }
        
        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtErr) {
            if (process.env.NODE_ENV === 'development') {
                console.log('JWT verification error:', jwtErr.message);
            }
            return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
        }

        // Check if token exists in user's tokens array and is not expired
        const user = await User.findOne({
            _id: decoded._id
        }).select('+tokens');

        if (!user) {
            return res.status(403).json({ status: 'error', message: 'User not found' });
        }

        // Check if token exists in user's tokens array
        const tokenData = user.tokens.find(t => t.token === token);
        
        if (!tokenData) {
            if (process.env.NODE_ENV === 'development') {
                console.log('Token not found in user tokens array. User has', user.tokens.length, 'tokens');
            }
            return res.status(403).json({ status: 'error', message: 'Token not found in user session' });
        }

        // Check if token is expired
        // If expiresAt doesn't exist (old tokens), verify JWT expiration instead
        if (tokenData.expiresAt) {
            if (tokenData.expiresAt < Date.now()) {
                // Remove expired token
                user.tokens = user.tokens.filter(t => t.token !== token);
                await user.save();
                if (process.env.NODE_ENV === 'development') {
                    console.log('Token expired. ExpiresAt:', new Date(tokenData.expiresAt), 'Now:', new Date());
                }
                return res.status(403).json({ status: 'error', message: 'Token expired' });
            }
        } else {
            // For tokens without expiresAt, check JWT expiration
            // JWT verification already happened above, so if we got here, token is valid
            // But we should add expiresAt for future use
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                user.tokens = user.tokens.filter(t => t.token !== token);
                await user.save();
                return res.status(403).json({ status: 'error', message: 'Token expired' });
            }
        }

        // Set user in the request (remove tokens from user object for security)
        const userObj = user.toObject();
        delete userObj.tokens;
        req.user = userObj;
        
        // Check if user is a seller
        if (user.role === 'seller' && user.seller) {
            const seller = await Seller.findById(user.seller);

            if (!seller) {
                return res.status(403).json({ status: 'error', message: 'Seller account not found' });
            }

            // Set seller in the request
            req.seller = seller;
        }

        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(415).json({ status: 'error', message: 'Unauthorized', error: err.message });
    }
};

module.exports = authenticateMiddleware;
