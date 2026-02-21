const express = require("express");
const router = express.Router();
const Order = require("../../Models/order/orderSchema");
const User = require('../../Models/auth/userSchema')
const Transaction = require("../../Models/transaction/transactionSchema");
const Product = require("../../Models/product/productSchema");
const { v4: uuidv4 } = require("uuid");

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const { check, validationResult, body } = require("express-validator");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const RefundRequest = require("../../Models/transaction/refundRequestSchema");
const sendEmail = require("../../utils/sendEmail");
const handleError = require("../../utils/errorHandler");

const customLogger = require('../../utils/logHandler');

// Create a place order
router.post(
    "/placeorder",
    authenticateMiddleware,
    [
        check("shippingAddress").not().isEmpty(),
        check("number").not().isEmpty(),
        check("products").isArray().not().isEmpty(),
        check("transactionId").not().isEmpty(),
        check("fullname").not().isEmpty(),
    ],
    async (req, res) => {
        customLogger("user", "user place order", req)
        // Data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shippingAddress, products, transactionId, number, fullname } = req.body;

        // let session;
        try {
            // session = await mongoose.startSession();
            // session.startTransaction();

            // find transaction is Completed or not
            const foundTransaction = await Transaction.findOne({
                trans_id: transactionId,
                status: "Completed",
            });

            console.log(foundTransaction)
            if (foundTransaction && !foundTransaction.cartId) {
                // Find product details
                const productDetails = [];
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    const foundProduct = await Product.findById(product.id);
                    if (!foundProduct) {
                        throw new Error(`Product with ID ${product.id} not found`);
                    }
                    productDetails.push({
                        product: foundProduct,
                        quantity: product.quantity,
                    });
                }

                const cartId = `cart_${Date.now()}_${uuidv4()}`;
                console.log(cartId)

                const sellers = new Set();
                for (let product of productDetails) {
                    const seller = product.product.seller;
                    const found = Array.from(sellers).some((s) => s._id.equals(seller._id));
                    if (!found) {
                        sellers.add(seller);
                    }
                }
                for (let seller of sellers) {
                    const sellerId = new ObjectId(seller); // ensure that seller is an ObjectId
                    const subOrderProducts = [];
                    for (let product of productDetails) {
                        if (product.product.seller.equals(sellerId)) {
                            console.log(product)
                            subOrderProducts.push({ product: product.product._id, quantity: product.quantity, price: product.product.price, discountedPrice: product.product.discountedPrice });
                        }
                    }
                    const order = await Order.create(
                        {
                            seller: sellerId,
                            shippingAddress,
                            number,
                            customer: req.user._id,
                            transactionId: foundTransaction._id,
                            cartId,
                            products: subOrderProducts,
                            fullname: fullname,
                        },
                    );
                    await order.save();
                }

                foundTransaction.cartId = cartId;
                foundTransaction.save();

                // await session.commitTransaction();
                // session.endSession();

                res.status(200).json({ cart_id: cartId, message: "Order placed successfully", status: 200 });
                const user = await User.findOne({
                    _id: req.user._id
                });
                user.address = shippingAddress;
                user.number = number;
                user.name = fullname;
                await user.save();
            } else {
                res.status(421).json({ message: "Can't place order as of now...", status: 421 });
                // await session.abortTransaction();
                // session.endSession();
                return;
            }
        } catch (error) {
            console.error(error);
            // if (session) {
            //     session.abortTransaction();
            //     session.endSession();
            // }
            res.status(500).json({ message: "Server Error" });
        }
    }
);

// Get all orders for a customer
router.get("/all-orders", authenticateMiddleware, async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Update orders that are more than 7 days old and have status 'Delivered'
        await Order.updateMany({
            createdAt: { $lt: oneWeekAgo },
            orderStatus: { $ne: 'Completed', $eq: 'Delivered' }
        },
            { orderStatus: 'Completed' });

        const orders = await Order.find({ customer: req.user._id })
            .populate({
                path: 'products.product',
                select: '-__v',
            })
            .populate('transactionId')
            .sort({ createdAt: -1 });
        res.status(200).send({ orders: orders, status: 200 });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// refund
router.post('/refund', [
    body('orderId').notEmpty(),
    body('reason').notEmpty(),
    body('bankDetails.accountHolderName').notEmpty(),
    body('bankDetails.bankName').notEmpty(),
    body('bankDetails.accountNumber').notEmpty(),
    body('bankDetails.ifscCode').notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const { orderId, reason } = req.body;

        const updatedOrder = await Order.findById(orderId).populate('customer');
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        updatedOrder.orderStatus = "Cancelled"
        updatedOrder.notes.cancelOrderReason = reason;

        await updatedOrder.save();

        const refundRequest = new RefundRequest({
            transactionId: updatedOrder.transactionId,
            orderId,
            reason,
            amount: updatedOrder.orderTotal,
            seller: updatedOrder.seller,
            customer: updatedOrder.customer
        });
        refundRequest.bankDetails.accountHolderName = req.body.bankDetails.accountHolderName
        refundRequest.bankDetails.bankName = req.body.bankDetails.bankName;
        refundRequest.bankDetails.accountNumber = req.body.bankDetails.accountNumber;
        refundRequest.bankDetails.ifscCode = req.body.bankDetails.ifscCode;

        await refundRequest.save();

        res.status(200).json({ status: 'success' });

        customLogger("user", "user requested for refund", req)

        const data = {
            subject: 'Cancel Request Received - QuickCart'
        };

        await sendEmail(updatedOrder.customer.email, data, './order/orderRefund.hbs');

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get ratings given by user for a specific product
router.get('/rating/:productId', authenticateMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate({
            path: 'ratings.user',
            match: { _id: req.user._id }, // only return ratings of req.user._id
            select: 'username'
        });
        const ratings = product?.ratings.filter(rating => rating.user); // remove any ratings where user is not found
        if (ratings === undefined) {
            res.status(200).json({ ratings: [] });
        } else {
            res.status(200).json({ ratings });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// save rating into product 
router.post('/rating/:productId/give', authenticateMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, review } = req.body;
        const objectId = new mongoose.Types.ObjectId(productId);
        const updatedProduct = await Product.findByIdAndUpdate(
            objectId,
            {
                $push: {
                    ratings: {
                        user: req.user._id,
                        rating: rating,
                        review: review
                    }
                }
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);

        customLogger("user", "user rated for product", req)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
