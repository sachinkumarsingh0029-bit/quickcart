const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const sellerController = require("../../controllers/seller/sellerController");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const checkSellerBanMiddleware = require("../../middleware/checkSellerBanMiddleware");
const checkSellerBanEmailMiddleware = require('../../middleware/checkSellerBanEmailMiddleware')

const router = express.Router();

// Apply for seller account
router.post(
    "/apply",
    [
        authenticateMiddleware,
        checkVerificationMiddleware,
        check("businessNumber").notEmpty().isNumeric(),
        check("businessName").notEmpty().isString().trim(),
        check("businessEmail").notEmpty().isEmail().normalizeEmail(),
        check("businessUsername").notEmpty().isString().trim(),
        check("businessRegistrationNumber").notEmpty().isString().trim(),
        check("businessType").notEmpty().isString().trim(),
        check("businessAddress").notEmpty().isString().trim(),
        check("businessWebsite").notEmpty().isURL(),
        check("taxIDNumber").notEmpty().isString().trim(),
        check("productCategories").isArray(),
    ],
    sellerController.applyForSellerAccount
);

// Route for verifying a seller
router.post(
    "/verify",
    [
        checkSellerBanMiddleware,
        check("code", "Verification code is required").notEmpty(),
        check("businessLogo", "Please include a Logo")
    ],
    sellerController.verifySeller
);

// seller login
router.post(
    "/login/:email",
    [
        checkSellerBanEmailMiddleware,
        check("email", "email is required").notEmpty().isEmail(),
        check("code", "code is required").notEmpty(),
        check("password", "password is required").notEmpty(),
    ],
    sellerController.loginSeller
);

// check login status
router.get(
    "/checkloginstatus/:email",
    sellerController.checkVerificationCode
);

// Get seller profile
router.get(
    "/profile",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getSellerProfile
);

// Update a seller by ID
router.put(
    "/updateprofile",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
        check("businessEmail").isEmail(),
        check("businessNumber").isMobilePhone(),
        check("businessName").not().isEmpty(),
        check("businessRegistrationNumber").not().isEmpty(),
        check("businessType").not().isEmpty(),
        check("businessAddress").not().isEmpty(),
        check("businessWebsite").isURL(),
        check("taxIDNumber").not().isEmpty(),
        check("businessLogo").not().isEmpty(),
        check("productCategories").isArray(),
    ],
    sellerController.updateSellerById
);

// Delete a seller by ID
router.delete(
    "/deleteprofile",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.deleteSellerById
);

// get seller products
router.get(
    "/products",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getSellerProducts
);

// get product by id
router.get(
    "/product/:id",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getProductById
);

// Create a product of a seller
router.post(
    "/createproduct",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.createProductForSeller
);

// UPDATE a product of a seller
router.put(
    "/updateproduct",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.updateProductForSeller
);

// DELETE a product of a seller
router.post(
    "/deleteproduct",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.deleteProductForSeller
);

// Get dashboard data 
router.get(
    "/get-metrics",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getDashboardData
);

// get sales data
router.get(
    "/get-sales-data",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getSalesData
);

// get orders
router.get(
    "/get-orders",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getOrders
);

// get orders
router.get(
    "/get-order/:orderId",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getOrdersById
);

// get refund data
router.get(
    "/get-refund-data",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getRefundRequest
);

// get refund data by id
router.get(
    "/get-refund-data/id/:refundId",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.getRefundRequestById
);

// update refund status
router.put(
    "/update-refund-status/:refundId",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.updateRefundRequestStatus
);

// update order status
router.put(
    "/update-order-status",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.updateOrderStatus
);

// cancel order
router.put(
    "/cancel-order",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.cancelOrder
);

// add tracking details
router.put(
    "/add-tracking-details",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.addTrackingDetails
);

// accept order
router.put(
    "/accept-order",
    [
        authenticateMiddleware,
        checkSellerBanMiddleware,
        authorizeMiddleware(["seller"]),
        checkVerificationMiddleware,
    ],
    sellerController.acceptOrder
);

module.exports = router;
