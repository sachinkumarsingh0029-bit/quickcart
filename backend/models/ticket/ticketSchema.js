const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Query', 'Complaint', 'Support', 'Feedback', 'Bug Report', 'Feature Request', 'Account Issue'],
        default: 'Query'
    },
    subject: {
        type: String,
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Open',
            'Pending',
            'In Progress',
            'Closed',
            'Waiting for Customer',
            'Waiting for Third Party',
            'Spam',
            'Resolved',
            'Reopened',
            'On Hold',
            'Escalated',
            'Cancelled',
            'Deferred',
            'Duplicate',
            'Not Reproducible',
            'More Information Needed',
            'In Review',
            'In Testing',
            'Completed',
            'Approved',
            'Rejected',
            'Blocked',
            'Transfer to Another Agent'
        ],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Low',
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [
        {
            message: {
                type: String,
            },
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            time: {
                type: Date,
                default: Date.now,
            }
        },
    ],
    reason: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
