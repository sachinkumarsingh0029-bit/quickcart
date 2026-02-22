const express = require('express');

const { param, check } = require('express-validator');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

const superAdminController = require('../../controllers/superadmin/superAdminController');

const checkVerificationMiddleware = require('../../middleware/checkVerificationMiddleware');

const router = express.Router();

// Get all admins
router.get('/admins', [authenticateMiddleware, authorizeMiddleware(['superadmin', 'root']), checkVerificationMiddleware], superAdminController.getAdmins);

module.exports = router;