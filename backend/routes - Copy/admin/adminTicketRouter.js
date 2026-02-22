const express = require('express');
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const Ticket = require('../../models/ticket/ticketSchema');
const handleError = require('../../utils/errorHandler');
const { validationResult } = require('express-validator');
const customLogger = require('../../utils/logHandler');

// Get all tickets
router.get('/tickets', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const tickets = await Ticket.find({});

        res.status(200).json({ tickets, status: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get ticket by id
router.get('/ticketbyid/:id', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById({ _id: id })
            .populate({
                path: 'messages.user_id',
                select: 'username role'
            })
            .populate({
                path: 'order',
                populate: [
                    { path: 'seller', select: 'businessUsername' },
                    { path: 'customer', select: 'username' },
                    { path: 'products.product', select: 'productName' },
                ]
            });
        res.json({ status: "success", ticket });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Add message to a ticket
router.post('/addmessage/:id', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    customLogger(req?.user?.role, `add message to ticket:- ${id} - ${message}`, req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
    }
    try {
        const ticket = await Ticket.findById({ _id: id }).populate({
            path: 'messages.user_id',
            select: 'username'
        });
        if (!ticket) {
            return res.status(422).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({ message, user_id: req.user._id });
        await ticket.save();
        res.status(201).json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
