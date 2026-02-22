const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const router = express.Router();

// Get applied sellers
router.get(
    "/applied-sellers",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getAllApplySellers
);

// get applied seller by id 
router.get(
    "/applied-seller/:sellerId",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getApplySellerById
);

// Accept seller
router.post(
    "/approve-seller/:sellerId",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.acceptSeller
);

// reject seller
router.post(
    "/reject-seller/:sellerId",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.rejectSeller
);

// Get all sellers
router.get("/sellers", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.getAllSellers);

// get seller by id
router.get("/getsellerbyid/:id", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.getSellerById);

// Update seller
router.put("/updateseller/:id", [
    authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])
], adminController.updateSeller);

// Delete seller
router.put("/deleteseller/:id", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.deleteSeller);

// ban seller
router.put("/banseller/:id", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.banSeller);

module.exports = router;
