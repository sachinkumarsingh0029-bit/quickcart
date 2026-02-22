const express = require("express");
const { check } = require("express-validator");

const authController = require("../../controllers/auth/authController");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");

const router = express.Router();

/* ===== SIGNUP ===== */
router.post(
  "/signup",
  [
    check("username").not().isEmpty().isLength({ min: 4, max: 15 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

/* ===== LOGIN ===== */
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").exists(),
  ],
  authController.login
);

/* ===== VERIFY SELLER OTP ===== */
router.post("/verify-seller-otp", authController.verifySellerOTP);

/* ===== GET PROFILE ===== */
router.get("/profile", authenticateMiddleware, authController.getUser);

/* ===== LOGOUT ===== */
router.post("/logout", authenticateMiddleware, authController.logout);

module.exports = router;