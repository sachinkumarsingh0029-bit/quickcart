const express = require("express");
const { check } = require("express-validator");

const authController = require("../../controllers/auth/authController");

const router = express.Router();

/* ================= SIGNUP ================= */
router.post(
  "/signup",
  [
    check("username").not().isEmpty().isLength({ min: 4, max: 15 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

/* ================= LOGIN ================= */
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").exists(),
  ],
  authController.login
);

/* ================= VERIFY SELLER LOGIN (🔥 FIXED NAME) ================= */
router.post(
  "/verify-seller-login",
  authController.verifySellerLogin
);

/* ================= LOGOUT ================= */
router.post("/logout", authController.logout);

module.exports = router;