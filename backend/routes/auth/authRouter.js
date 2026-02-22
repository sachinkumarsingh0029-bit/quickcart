const express = require("express");
const { check } = require("express-validator");

const authController = require("../../controllers/auth/authController");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").notEmpty().isLength({ min: 4, max: 15 }),
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

router.get(
  "/profile",
  authenticateMiddleware,
  authController.getUser
);

router.post(
  "/logout",
  authenticateMiddleware,
  authController.logout
);

module.exports = router;