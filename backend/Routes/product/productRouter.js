const express = require('express');
const { getSellerProduct, getAllProductsOfSellerByUsername, getProductById, getTopProductsInCategory, getRecommendations, getTopProducts, searchProductsByKeywords, getTopProductsByDifferentFilters, getTopProductsByTopCategorySearched, searchProductsByCategory } = require('../../controllers/product/productController');
const Product = require('../../Models/product/productSchema');
const { default: mongoose } = require('mongoose');
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const handleError = require('../../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../../Models/auth/userSchema');

const router = express.Router();

// GET all products and profile of a seller by username
router.get('/seller/:username',
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', getSellerProduct);

// GET a product by ID
router.get('/search/:id', getProductById);

// Get ratings data
router.get('/ratings/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // check if document exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        // get total number of ratings
        const totalRatings = await Product.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(productId) } },
            { $project: { _id: 0, totalRatings: { $size: "$ratings" } } }
        ]);

        // get average rating
        const averageRating = await Product.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(productId) } },
            { $unwind: "$ratings" },
            { $group: { _id: null, averageRating: { $avg: "$ratings.rating" } } },
            { $project: { _id: 0, averageRating: { $round: ["$averageRating", 1] } } }
        ]);

        // get percentages for each rating
        const ratingsCount = await Product.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(productId) } },
            { $project: { _id: 0, ratings: 1 } },
            { $unwind: "$ratings" },
            {
                $group: {
                    _id: "$ratings.rating",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    rating: "$_id",
                    percentage: { $multiply: [{ $divide: ["$count", totalRatings[0].totalRatings] }, 100] }
                }
            },
            {
                $sort: {
                    rating: -1
                }
            }
        ]);

        // combine all results into a single object
        const result = {
            average: averageRating[0]?.averageRating || 0,
            total: totalRatings[0]?.totalRatings || 0,
            percentages: {}
        };

        ratingsCount.forEach(rating => {
            if (rating.percentage) {
                result.percentages[rating.rating] = rating.percentage.toFixed(0) + "%";
            } else {
                result.percentages[rating.rating] = "0";
            }
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Predict the top 5 most popular products in a category
router.get('/category/trending', getTopProductsInCategory);

// Predict the top 5 most popular product
router.get('/trending', getTopProducts);

// Top products by popularityscore, views, likes, ratings
router.get('/getTopProductsByDifferentFilters', getTopProductsByDifferentFilters);

// Top products by top searched category
router.get('/getTopProductsByTopCategorySearched', getTopProductsByTopCategorySearched);

// Search products by keywords
router.get('/search', searchProductsByKeywords);

// Search products by keywords
router.get('/search/category/:category', searchProductsByCategory);

// Search products by history
router.get('/recommendations', getRecommendations)

// like product
router.post('/like/:productId', authenticateMiddleware, async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user?._id; // assuming the user ID is sent in the request body

        if (!userId) {
            return res.status(499).json({ message: 'Login Required' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already liked the product
        if (product.likes.includes(userId)) {
            return res.status(400).json({ message: 'User has already liked this product' });
        }

        // Add the user to the likes array and save the updated product
        product.likes.push(userId);
        await product.save();

        res.status(200).json({ message: 'Product liked' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user Liked product or not
router.get('/liked/:productId', async (req, res) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        // Check if not token
        if (!token) {
            return;
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is blacklisted
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.expiresAt': { $gte: Date.now() }
        });

        if (user) {
            const productId = req.params.productId;
            const product = await Product.findById(productId);
            if (!product) {
                return handleError(res, {
                    code: "not_found",
                    status: "error",
                    message: "Product not found",
                });
            }
            console.log(product.likes)
            if (product.likes.length > 0) {
                const isLiked = user?._id && product.likes?.some(like => like.toString() === user?._id.toString() || false);
                res.status(200).json({ isLiked });
            }
        } else {
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;