const { validationResult } = require('express-validator');
const Product = require('../../models/product/productSchema');
const Seller = require('../../models/seller/sellerSchema');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const customLogger = require('../../utils/logHandler');

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            status: "success",
            message: "All products retrieved successfully",
            products: products,
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// GET all products of a seller by username
const getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('products');
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Retrieved all products of the seller',
            data: {
                products: seller.products
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// Get a product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Retrieved product successfully',
            product: product
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update product
const updateProduct = async (req, res, next) => {
    customLogger(req.user.role, "update product", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const product = await Product.findOne({ _id: req.params.productId }).populate('seller');
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        product.productName = req.body.productName;
        product.productDescription = req.body.productDescription;
        product.price = req.body.price;
        product.discountedPrice = req.body.discountedPrice;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
        product.imagesUrl = req.body.imagesUrl;
        product.thumbnailUrl = req.body.thumbnailUrl;
        product.tags = req.body.tags;
        product.faqs = req.body.faqs;
        product.keywords = req.body.keywords;
        product.updatedBy = {
            role: req.user.role,
            userId: req.user._id
        }

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully'
        });

        const data = {
            username: product.seller.businessUsername,
            productName: product.productName,
            adminUsername: req.user.username,
            updateReason: req.body.updateReason,
            subject: 'Product Updated - QuickCart'
        };

        await sendEmail(product.seller.businessEmail, data, './violationOfTerms/productUpdated.hbs');

    } catch (error) {
        return handleError(res, error);
    }
};

// DELETE product
const deleteProduct = async (req, res, next) => {
    customLogger(req.user.role, "delete product", req)
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.productId }).populate('seller');
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        res.status(204).json({
            status: 'success',
            message: 'Product deleted successfully'
        });

        const data = {
            username: product.seller.businessUsername,
            productName: product.productName,
            adminUsername: req.user.username,
            deletionDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            timeZone: 'IST',
            violationReason: req.body.violationReason,
            subject: 'Product Deleted - QuickCart'
        };

        await sendEmail(product.seller.businessEmail, data, './violationOfTerms/productDeleted.hbs');

    } catch (error) {
        return handleError(res, err);
    }
};


module.exports = {
    getAllProducts,
    getAllProductsOfSellerByUsername,
    getProductById,
    updateProduct,
    deleteProduct,
};
