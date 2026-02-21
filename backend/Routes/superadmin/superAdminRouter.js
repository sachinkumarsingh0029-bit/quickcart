const express = require('express');

const router = express.Router();

const manageAdmins = require('./manageAdmins');

router.use('/admin', manageAdmins);

module.exports = router;