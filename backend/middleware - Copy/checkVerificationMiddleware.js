const checkVerificationMiddleware = async (req, res, next) => {
    try {
        // Check seller verification status
        if (req.user.role === 'seller') {
            if (req.seller.verificationCode && !req.seller.verificationStatus) {
                return res.status(413).json({ status: 'info', message: 'Verification pending', code: 'verification_pending' });
            }
            if (!req.seller.verificationStatus) {
                return res.status(414).json({ status: 'error', message: 'Unauthorized: Email not verified', code: 'unauthorized_email' });
            }
        } else {
            // Check user verification status
            if (req.user.verificationCode && !req.user.verificationStatus) {
                return res.status(413).json({ status: 'info', message: 'Verification pending', code: 'verification_pending' });
            }
            if (!req.user.verificationStatus) {
                return res.status(414).json({ status: 'error', message: 'Unauthorized: Email not verified', code: 'unauthorized_email' });
            }
        }
        next();
    } catch (err) {
        return res.status(415).json({ status: 'error', message: 'Unauthorized' });
    }
};

module.exports = checkVerificationMiddleware;
