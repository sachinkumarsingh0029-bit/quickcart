const express = require("express");
const { check } = require("express-validator");

const authController = require("../../controllers/auth/authController");

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").not().isEmpty().isLength({ min: 4, max: 15 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").exists(),
  ],
  authController.login
);

router.post("/verify-seller-login", authController.verifySellerLogin);

router.post("/logout", authController.logout);

module.exports = router;