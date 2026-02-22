const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketmaster/ticketMasterController');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

const Ticket = require('../../models/ticket/ticketSchema');
const { check } = require('express-validator');

// login as tikcet master
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    ticketController.ticketMasterLogin
);

// Get all tickets
router.get('/tickets', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.getAllTickets);

// POST join ticket as agent
router.post('/ticket/:id/join', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.ticketJoin);

// Get tickets assigned to current ticketmaster
router.get('/tickets/assigned', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], async (req, res) => {
    try {
        const tickets = await Ticket.find({ agent_id: req.user._id })
            .populate({
                path: 'messages.user_id',
                select: 'username'
            })
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET ticket by id
router.get('/ticket/:id', authenticateMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById({ _id: id, agent_id: req.user._id })
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

// Add message to ticket
router.post('/ticket/:id/message', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.addMessage);

// Change ticket priority
router.put('/ticket/:id/update', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.changeTicketStatus);

// Route to reassign a ticket to another agent
router.put('/ticket/:id/reassign', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.reassignTicket);

module.exports = router;
