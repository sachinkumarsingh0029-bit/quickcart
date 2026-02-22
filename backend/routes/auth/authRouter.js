const express = require("express");
const { check } = require("express-validator");

const authController = require("../../controllers/auth/authController");

const router = express.Router();

/* ================= SIGNUP ================= */
router.post(
  "/signup",
  [
    check("username").notEmpty().isLength({ min: 4, max: 15 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

/* ================= LOGIN ================= */
router.post("/login", authController.login);

/* ================= VERIFY SELLER LOGIN ================= */
router.post("/verify-seller-login", authController.verifySellerLogin);

/* ================= RESEND USER VERIFICATION ================= */
router.post(
  "/resend-user-verification",
  authController.resendUserVerificationCode
);

/* ================= RESEND SELLER OTP ================= */
router.post(
  "/sendVerificationCodeAgain",
  authController.sendVerificationCodeAgain
);

/* ================= LOGOUT ================= */
router.post("/logout", authController.logout);

module.exports = router;