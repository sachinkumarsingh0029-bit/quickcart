const handleError = require('../../utils/errorHandler');
const Ticket = require('../../models/ticket/ticketSchema');
const { validationResult } = require('express-validator');
const User = require('../../models/auth/userSchema');
const { ObjectId } = require('mongodb');
const customLogger = require('../../utils/logHandler');

// ticket master login
const ticketMasterLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    customLogger("ticketmaster", "login", req)

    const { email, password } = req.body;

    try {
        User.findByCredentials(email, password).then(async ({ token, user }) => {

            if (!user) {
                return handleError(res, {
                    message: 'Invalid Credentials',
                    status: 401,
                    code: 'authentication_failed'
                });
            }
            if (user.role === "ticketmaster") {
                res.cookie('token', token, {
                    httpOnly: true, // cookie cannot be accessed from client-side scripts
                    secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // cookie should only be sent for same-site requests
                    maxAge: 5 * 60 * 60 * 1000 // 5hr
                });

                res.status(200).json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        address: user.address,
                        verificationStatus: user.verificationStatus,
                        role: user.role,
                        number: user.number
                    },
                    status: 'success'
                });
            } else {
                return handleError(res, {
                    message: 'Invalid Credentials',
                    status: 401,
                    code: 'authentication_failed'
                });
            }
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        return handleError(res, {
            message: 'Invalid Credentials',
            status: 401,
            code: 'authentication_failed'
        });
    }
};

// get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ agent_id: null, status: { $in: ['Open', 'Transfer to Another Agent'] } })
            .populate({
                path: 'messages.user_id',
                select: 'username'
            })
            .populate('order').sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Join ticket as agent
const ticketJoin = async (req, res) => {
    try {
        customLogger("ticketmaster", `ticket join:- ${req.params.id}`, req)
        const ticket = await Ticket.findById(req.params.id);

        // Check if ticket already has an agent assigned
        if (ticket.agent_id) {
            return res.status(400).json({ error: 'Ticket already has an agent assigned' });
        }

        // Assign current user as agent for ticket
        ticket.agent_id = new ObjectId(req.user._id);
        await ticket.save();

        res.status(200).json({ status: "success", message: 'You have joined the ticket as an agent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add message to ticket
const addMessage = async (req, res) => {
    try {
        const ticket = await Ticket.findById({ _id: req.params.id, agent_id: req.user._id });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if ticket master is the agent assigned to the ticket
        if (ticket.agent_id.toString() !== req.user._id.toString()) {
            return res.status(499).json({ error: 'You are not authorized to add a message to this ticket' });
        }

        ticket.messages.push({
            message: req.body.message,
            user_id: req.user._id
        });
        await ticket.save();
        res.status(200).json({ status: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change ticket priority
const changeTicketStatus = async (req, res) => {
    try {
        customLogger("ticketmaster", `ticket change status:- ${req.params.id}`, req)
        const ticket = await Ticket.findById(req.params.id).populate({
            path: 'messages.user_id',
            select: 'username'
        })
            .populate({
                path: 'order',
                populate: [
                    { path: 'seller', select: 'businessUsername' },
                    { path: 'customer', select: 'username' },
                    { path: 'products.product', select: 'productName' },
                ]
            });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if ticket master is the agent assigned to the ticket
        if (ticket.agent_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorized to change the priority of this ticket' });
        }

        ticket.priority = req.body.priority;
        ticket.status = req.body.status;
        ticket.type = req.body.type;
        await ticket.save();
        res.status(200).json({ status: "success", ticket: ticket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller to reassign a ticket to another agent
const reassignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority, reason } = req.body;
        customLogger("ticketmaster", `ticket reassign:- ${req.params.id} - ${priority}`, req)

        // find the current agent's ticket
        const ticket = await Ticket.findOne({ _id: id, agent_id: req.user._id });

        console.log(ticket)
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // update the ticket with the new agent and status
        await Ticket.updateOne(
            { _id: id },
            { $unset: { agent_id: null }, $set: { status: 'Transfer to Another Agent', priority: priority, reason: reason } }
        );

        res.status(200).json({ status: 'success', message: 'Ticket reassigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { ticketMasterLogin, addMessage, getAllTickets, changeTicketStatus, ticketJoin, reassignTicket };
