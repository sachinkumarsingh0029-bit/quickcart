const express = require('express');
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

const Log = require('../../models/log/logSchema');

// Get all logs of user
router.get('/userlogs', [authenticateMiddleware, authorizeMiddleware(["superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const userlogs = await Log.find({ message: 'user' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', userlogs: userlogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get all logs of seller
router.get('/sellerlogs', [authenticateMiddleware, authorizeMiddleware(["superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const userlogs = await Log.find({ message: 'seller' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', userlogs: userlogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get all logs of ticketmaster
router.get('/ticketmasterlogs', [authenticateMiddleware, authorizeMiddleware(["superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const userlogs = await Log.find({ message: 'ticketmaster' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', userlogs: userlogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get all logs of admin
router.get('/adminlogs', [authenticateMiddleware, authorizeMiddleware(["superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const adminLogs = await Log.find({ message: 'admin' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', adminLogs: adminLogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get all logs of superadmin
router.get('/superadminlogs', [authenticateMiddleware, authorizeMiddleware(["root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const superAdminLogs = await Log.find({ message: 'superadmin' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', superAdminLogs: superAdminLogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get all logs of errors
router.get('/errorlogs', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const errorLogs = await Log.find({ level: 'error' }).sort({ timestamp: -1 }).exec();
        res.status(200).json({ status: 'success', errorLogs: errorLogs });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
