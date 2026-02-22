const express = require("express");
const { check, validationResult } = require("express-validator");

const authController = require("../../controllers/auth/authController");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

const {
  sendVerificationCodeAgain,
  verifyUser,
} = require("../../controllers/auth/verificationController");

const handleError = require("../../utils/errorHandler");

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

router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").exists(),
  ],
  authController.login
);

/* ================= CHECK LOGIN ================= */

router.get("/check", authenticateMiddleware, (req, res) =>
  res.status(200).json({
    status: "success",
    message: "User is logged in",
    user: req.user,
  })
);

/* ================= VERIFY EMAIL ================= */

router.post(
  "/verify",
  [
    authenticateMiddleware,
    check("code").isLength({ min: 4, max: 4 }).isNumeric(),
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
        return res.status(400).json({
          status: "error",
          message: "User already verified",
        });
      }

      const { code } = req.body;
      const result = await verifyUser(req.user.email, code);

      res.status(200).json({
        status: "success",
        ...result,
      });
    } catch (err) {
      return handleError(res, err);
    }
  }
);

/* ================= PROFILE ================= */

router.get(
  "/profile",
  [authenticateMiddleware, checkVerificationMiddleware],
  authController.getUser
);

/* ================= UPDATE PROFILE ================= */

router.put(
  "/updateprofile",
  [
    authenticateMiddleware,
    checkVerificationMiddleware,
    check("username").notEmpty(),
    check("name").notEmpty(),
    check("email").isEmail(),
    check("address").notEmpty(),
    check("number").notEmpty(),
  ],
  authController.updateProfile
);

/* ================= UPDATE PASSWORD ================= */

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

/* ================= DELETE ACCOUNT ================= */

router.post(
  "/deleteaccount",
  [authenticateMiddleware, checkVerificationMiddleware],
  authController.deleteAccount
);

/* ================= LOGOUT ================= */

router.post(
  "/logout",
  authenticateMiddleware,
  authController.logout
);

/* ================= FORGOT PASSWORD ================= */

router.post(
  "/forgotpassword",
  [check("email").isEmail()],
  authController.forgotPassword
);

/* ================= RESET PASSWORD ================= */

router.put(
  "/resetpassword",
  [
    check("newPassword").isLength({ min: 6 }),
    check("resetToken").exists(),
  ],
  authController.resetPassword
);

module.exports = router;