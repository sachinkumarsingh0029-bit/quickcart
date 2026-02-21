const Admin = require('../../models/auth/userSchema');
const handleError = require('../../utils/errorHandler');

// get all admins
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' });
        return res.status(200).json({ admins: admins, status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
}

module.exports = { getAdmins };