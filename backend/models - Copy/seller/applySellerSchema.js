const mongoose = require('mongoose');
const validator = require('validator');

const applySellerSchema = new mongoose.Schema({
    businessEmail: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email Address',
        },
    },
    businessNumber: {
        type: String,
        required: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Invalid phone number',
        },
    },
    businessName: {
        type: String,
        required: true,
    },
    businessUsername: {
        type: String,
        required: true,
        index: true,
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        index: true,
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Wholesale', 'Manufacturing'],
    },
    businessAddress: {
        type: String,
        required: true,
    },
    businessWebsite: {
        type: String,
        required: true,
    },
    taxIDNumber: {
        type: String,
        required: true,
    },
    productCategories: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
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

// Post save middleware for validation errors
applySellerSchema.post('validate', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('applySeller', applySellerSchema);