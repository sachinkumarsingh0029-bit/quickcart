const express = require('express');
const router = express.Router();

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const Order = require('../../models/order/orderSchema');
const Product = require('../../models/product/productSchema');
const Ticket = require('../../models/ticket/ticketSchema');
const Search = require('../../models/search/searchSchema');
const User = require('../../models/auth/userSchema');
const Seller = require('../../models/seller/sellerSchema');

// Get all transactions by customer
router.get('/get-metrics', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], async (req, res) => {
    const { from, to } = req.query;

    const today = new Date();
    const startDate = from ? new Date(from) : new Date(today.getFullYear(), today.getMonth(), 2);
    const endDate = to ? new Date(to) : new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    try {
        const orderTotal = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$orderTotal" },
                    count: { $sum: 1 }
                },
            },
        ]);

        const newCustomers = await Order.distinct("customer", {
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const returningCustomers = await Order.distinct("customer", {
            createdAt: { $lt: startDate },
        });

        const retentionRate =
            returningCustomers.length > 0
                ? ((newCustomers.length / returningCustomers.length) * 100).toFixed(2)
                : 0;

        const totalOrders = await Order.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const newCustomersThisMonth = newCustomers.filter(
            (customer) => !returningCustomers.includes(customer)
        );

        const avgOrderValue = (orderTotal.length > 0 && orderTotal[0].total) ? (orderTotal[0].total / totalOrders).toFixed(2) : 0;

        const avgOrderSize = (orderTotal.length > 0 && orderTotal[0].count) ? (orderTotal[0].count / totalOrders).toFixed(0) : 0;


        const productListings = await Product.aggregate([
            {
                $project: {
                    _id: 0,
                    views: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            },
        ]);

        const conversionRate = (totalOrders > 0) ? ((totalOrders / productListings[0].totalViews) * 100).toFixed(2) : 0;

        const topSellingProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: "$products.product",
                    totalSales: { $sum: "$products.price" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $project: {
                    "product.productlistings._id": 0,
                    "product.productlistings.__v": 0,
                    "product.productlistings.createdAt": 0,
                    "product.productlistings.updatedAt": 0
                }
            },
            {
                $sort: {
                    totalSales: -1
                }
            },
            {
                $limit: 5
            }
        ]);

        const totalTickets = await Ticket.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const totalSearches = await Search.countDocuments({
            timestamp: { $gte: startDate, $lte: endDate },
        });

        const totalUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const totalSellers = await Seller.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
        });

        res.status(200).json({
            orderTotal: orderTotal.length > 0 ? orderTotal[0].total : 0,
            newCustomers: newCustomersThisMonth.length,
            returningCustomers: returningCustomers.length,
            retentionRate: retentionRate,
            totalOrders: totalOrders,
            avgOrderValue: avgOrderValue,
            avgOrderSize: avgOrderSize,
            conversionRate: conversionRate,
            totalViews: productListings.length > 0 ? productListings[0].totalViews : 0,
            topSellingProducts: topSellingProducts,
            totalTickets: totalTickets,
            totalSearches: totalSearches,
            totalUsers: totalUsers,
            totalSellers: totalSellers
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get(
    "/get-sales-data",
    [
        authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware,
    ],
    async (req, res) => {
        const today = new Date();
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
        const firstDayOfSixMonthsAgo = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1);

        try {
            const salesData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: firstDayOfSixMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                        sales: { $sum: "$orderTotal" },
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        year: "$_id.year",
                        sales: "$sales",
                        count: "$count",
                    },
                },
                {
                    $sort: {
                        year: 1,
                        month: 1,
                    },
                },
            ]);

            const labels = [];
            const sales = [];
            const counts = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
                const year = date.getFullYear();
                const monthData = salesData.find((d) => d.month === date.getMonth() + 1 && d.year === year);
                labels.unshift(`${monthName} ${year}`);
                sales.unshift(monthData ? monthData.sales : 0);
                counts.unshift(monthData ? monthData.count : 0);
            }

            res.status(200).json({
                labels,
                sales,
                counts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
);

module.exports = router;
