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

/* ================= VERIFY SELLER LOGIN ================= */
router.post(
  "/verify-seller-login",
  authController.verifySellerLogin
);

/* ================= 🔥 RESEND OTP ================= */
router.post(
  "/sendVerificationCodeAgain",
  authController.sendVerificationCodeAgain
);

/* ================= LOGOUT ================= */
router.post("/logout", authController.logout);

/* ================= CHECK AUTH ================= */
const jwt = require("jsonwebtoken");
const User = require("../../models/auth/userSchema");

router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: "error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ status: "error" });
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err) {
    res.status(401).json({ status: "error" });
  }
});

module.exports = router;