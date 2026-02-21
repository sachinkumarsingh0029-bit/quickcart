const express = require("express");
const { check, param } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

const router = express.Router();

// GET /products
router.get(
    "/products",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getAllProducts
);

// GET /products/seller/:username
router.get(
    "/product/seller/:username",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getAllProductsOfSellerByUsername
);

// GET /products/:id
router.get(
    "/productbyid/:productId",
    [
        [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
        param("id").isMongoId(),
    ],
    adminController.getProductById
);

// PUT /products/:id
router.put(
    "/updateproduct/:productId",
    [
        authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware,
    ],
    adminController.updateProduct
);

// DELETE /products/:id
router.post(
    "/deleteproduct/:productId",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.deleteProduct
);

module.exports = router;
