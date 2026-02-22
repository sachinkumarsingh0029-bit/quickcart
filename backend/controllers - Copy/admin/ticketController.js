const Ticket = require('../models/ticket/ticketSchema');

// Get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate({
            path: 'messages.user_id',
            select: 'username'
        }).populate('order');
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get ticket by id
const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate({
            path: 'messages.user_id',
            select: 'username'
        }).populate('order');
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add message to a ticket
const addMessage = async (req, res) => {
    try {
        const ticket = await Ticket
            .findById(req.params.id)
            .populate('user_id', 'username')
            .populate('agent_id', 'username');
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        const { message } = req.body;
        const newMessage = {
            message,
            user_id: req.user.id
        };
        ticket.messages.push(newMessage);
        ticket.status = 'Pending';
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    addMessage,
};