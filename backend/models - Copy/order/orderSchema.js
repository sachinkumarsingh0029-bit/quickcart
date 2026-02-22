const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Product = require('../product/productSchema');
const sendEmail = require('../../utils/sendEmail');
const User = require('../auth/userSchema');
const Payroll = require('../payroll/payrollSchema');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 25,
    },
    cartId: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        trim: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                default: 0,
            },
            discountedPrice: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Payment Failed', 'Cancelled', 'Completed', 'Returned'],
        required: true,
        default: 'Placed',
    },
    trackingDetails: {
        carrierName: {
            type: String,
            required: false,
        },
        trackingNumber: {
            type: String,
            required: false,
        },
        trackingUrl: {
            type: String,
            required: false,
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        deliveryStatus: {
            type: String,
            required: false,
            enum: ['In Transit', 'Out for Delivery', 'Delivered', 'Exception'],
        },
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    orderTotal: {
        type: Number,
        default: 0,
    },
    notes: {
        cancelOrderReason: {
            type: String,
            required: false,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

// Generate sellerID before saving to the database
orderSchema.pre('save', async function () {
    if (!this.orderId) {
        this.orderId = `order_${Date.now()}_${uuidv4()}`;
    }
});

// Save order ID to seller's orders array
orderSchema.pre('save', async function () {
    try {
        if (this.isNew) { // check if the document is new
            const Seller = mongoose.model('Seller');
            const seller = await Seller.findOne({ _id: this.seller });
            seller.orders.push(this._id);
            await seller.save();
            const data = {
                sellerName: seller.businessName,
                subject: 'New Order - QuickCart'
            };

            // Send email
            sendEmail(seller.businessEmail, data, './order/informSeller.hbs');
        }
    } catch (error) {
        throw error;
    }
});


// desrease quantity of product
orderSchema.pre('save', async function () {
    if (this.isNew) {
        try {
            const products = this.products;
            let orderAmount = 0;
            let totalDiscount = 0;
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findByIdAndUpdate(
                    products[i].product,
                    { $inc: { quantity: -products[i].quantity } },
                    { runValidators: true, new: true }
                );
                if (product) {
                    const price = product.price;
                    const discountedPrice = product.discountedPrice || price;
                    const quantity = products[i].quantity;

                    orderAmount += price * quantity;
                    totalDiscount += (price - discountedPrice) * quantity;
                }

                this.orderAmount = orderAmount;
                this.totalDiscount = totalDiscount;
                this.orderTotal = orderAmount - totalDiscount;
            }
        } catch (error) {
            throw error;
        }
    }
});

// Update order status
orderSchema.pre('save', async function () {
    try {
        if (this.orderStatus === "Delivered" || this.trackingDetails.deliveryStatus === "Delivered") {
            this.trackingDetails.deliveryStatus = "Delivered"
            this.orderStatus = "Delivered"
            const customer = await User.findById(this.customer);
            const data = {
                customerName: customer.name,
                totalCost: this.orderTotal,
                subject: 'Order Delivered - QuickCart'
            };
            // Send email
            sendEmail(customer.email, data, './order/orderDelivered.hbs');
        }
    }
    catch (error) {
        throw error;
    }
});


module.exports = mongoose.model('Order', orderSchema);