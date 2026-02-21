const express = require("express");
const { check, validationResult } = require("express-validator");

const authController = require("../../controllers/auth/authController");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const checkUserBanMiddleware = require("../../middleware/checkUserBanMiddleware");
const signupRateLimiter = require("../../middleware/signupRateLimiter");

const {
  sendVerificationCodeAgain,
  verifyUser,
} = require("../../controllers/auth/verificationController");

const handleError = require("../../utils/errorHandler");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const customLogger = require("../../utils/logHandler");

const router = express.Router();


// ================= NORMAL ROUTES =================

// Signup
router.post(
  "/signup",
  [
    check("username").not().isEmpty().isLength({ min: 4, max: 15 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

// Login
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").exists(),
  ],
  authController.login
);

// Check login
router.get("/check", [authenticateMiddleware], (req, res) =>
  res.status(200).json({
    status: "success",
    message: "User is logged in",
    user: req.user,
  })
);

// Email verification resend
router.post(
  "/sendVerificationCodeAgain",
  [authenticateMiddleware],
  async (req, res) => {
    try {
      const { email } = req.user;
      const status = await sendVerificationCodeAgain(email);
      return res.status(200).json({ status: "success", ...status });
    } catch (err) {
      return handleError(res, err);
    }
  }
);

// Verify
router.post(
  "/verify",
  [
    check("code").isLength({ min: 4, max: 4 }).isNumeric(),
    authenticateMiddleware,
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleError(res, {
          name: "CustomValidationError",
          status: "error",
          errors: errors.array(),
        });
      }

      if (req.user.verificationStatus) {
        return res.status(411).json({
          status: "error",
          message: "User already verified",
        });
      }

      const { code } = req.body;
      const status = await verifyUser(req.user.email, code);
      res.status(200).json({ status: "success", ...status });
    } catch (err) {
      return handleError(res, err);
    }
  }
);

// Profile
router.get(
  "/profile",
  [authenticateMiddleware, checkVerificationMiddleware],
  authController.getUser
);

// Update profile
router.put(
  "/updateprofile",
  [
    authenticateMiddleware,
    checkVerificationMiddleware,
    check("username").notEmpty().trim(),
    check("name").notEmpty().trim(),
    check("email").isEmail().normalizeEmail(),
    check("address").notEmpty().trim(),
    check("number").notEmpty().trim(),
  ],
  authController.updateProfile
);

// Update password
router.put(
  "/updatepassword",
  [
    authenticateMiddleware,
    checkVerificationMiddleware,
    check("currentPassword").exists(),
    check("newPassword").isLength({ min: 6 }),
  ],
  authController.updatePassword
);

// Delete account
router.post(
  "/deleteaccount",
  [authenticateMiddleware, checkVerificationMiddleware],
  authController.deleteAccount
);

// Logout
router.post(
  "/logout",
  [authenticateMiddleware, checkVerificationMiddleware],
  authController.logout
);

// Forgot password
router.post(
  "/forgotpassword",
  [check("email").isEmail()],
  authController.forgotPassword
);

// Reset password
router.put(
  "/resetpassword",
  [
    check("newPassword").isLength({ min: 6 }),
    check("resetToken").exists(),
  ],
  authController.resetPassword
);

module.exports = router;