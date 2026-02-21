const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const sellerSchema = new mongoose.Schema({
    sellerID: {
        type: String,
        unique: true, // Make sellerID unique
        index: true // Add index for faster lookups
    },
    businessEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email Address'
        }
    },
    businessNumber: {
        type: String,
        required: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Invalid phone number'
        }
    },
    businessLogo: {
        type: String,
    },
    businessName: {
        type: String,
        required: true,
        index: 'text'
    },
    businessUsername: {
        type: String,
        required: true,
        unique: true,
        index: 'text'
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Wholesale', 'Manufacturing']
    },
    businessAddress: {
        type: String,
        required: true
    },
    businessWebsite: {
        type: String,
        required: true
    },
    taxIDNumber: {
        type: String,
        required: true,
        unique: true
    },
    paymentPreferences: {
        type: String,
    },
    blockchainWalletAddress: {
        type: String,
    },
    paypalAccountEmailAddress: {
        type: String,
    },
    productCategories: {
        type: [String],
        required: true
    },
    productListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    ratingAvg: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    loginCode: {
        type: String,
        default: null,
    },
    loginCodeExpiresAt: {
        type: Date,
        default: null,
    },
    verificationStatus: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        default: null,
    },
    verificationCodeExpiresAt: {
        type: Date,
        default: null,
    },
    banStatus: {
        isBanned: {
            type: Boolean,
            default: false,
        },
        banExpiresAt: {
            type: Date,
            required: false,
            default: null
        },
    },
}, { timestamps: true });


// Generate sellerID before saving to the database
sellerSchema.pre('save', async function () {
    if (!this.sellerID) {
        this.sellerID = uuidv4().toUpperCase();
    }
});

sellerSchema.post('validate', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else {
        next(error);
    }
});

sellerSchema.post('save', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else if (error.name === 'MongoError' && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate key error: ${duplicateKey} already exists`));
    } else {
        next(error);
    }
});

sellerSchema.pre('save', async function () {
    try {
        const productIds = this.productListings.map((listing) => listing._id);
        const Product = mongoose.model('Product');
        const products = await Product.find({ _id: { $in: productIds } });
        const ratings = products.map((product) => product.ratingsAvg).filter((rating) => rating !== undefined);
        const sumRatings = ratings.reduce((acc, curr) => acc + curr, 0);
        const avgRating = ratings.length > 0 ? sumRatings / ratings.length : 0;
        this.ratingAvg = avgRating;
    } catch (error) {
        throw error;
    }
});

sellerSchema.post('findOneAndUpdate', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else if (error.name === 'MongoError' && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate key error: ${duplicateKey} already exists`));
    } else {
        next(error);
    }
});

sellerSchema.pre('findOneAndDelete', async function () {
    const productIds = this?.productListings?.map((listing) => listing._id);
    await mongoose.model('Product').deleteMany({ _id: { $in: productIds } });
});

sellerSchema.pre(/^find/, async function () {
    this.populate({
        path: 'user',
        select: 'fullName email phoneNumber',
    });
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
