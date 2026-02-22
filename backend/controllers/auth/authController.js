const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../../models/auth/userSchema");
const Seller = require("../../models/seller/sellerSchema");
const handleError = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendEmail");
const generateCode = require("../../utils/generateCode");

/* ================= COOKIE OPTIONS ================= */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 5 * 60 * 60 * 1000,
};

/* ================= SIGNUP ================= */

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, {
      status: "error",
      errors: errors.array(),
    });
  }

  const { email, password, username } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Signup successful",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    /* ===== SELLER LOGIN ===== */

    if (user.role === "seller") {
      const seller = await Seller.findOne({ user: user._id });

      if (!seller) {
        return res.status(404).json({
          status: "error",
          message: "Seller profile not found",
        });
      }

      const otpCode = generateCode();
      seller.loginCode = otpCode;
      seller.loginCodeExpiresAt = Date.now() + 10 * 60 * 1000;
      await seller.save();

      await sendEmail(
        seller.businessEmail,
        {
          subject: "Seller Login OTP - QuickCart",
          username: seller.businessName,
          verificationCode: otpCode,
        },
        "seller/loginVerification.hbs"
      );

      return res.status(200).json({
        status: "success",
        role: "seller",
        message: "OTP sent to seller email",
      });
    }

    /* ===== NORMAL USER LOGIN ===== */

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "5h" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= VERIFY SELLER LOGIN ================= */

exports.verifySellerLogin = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    const seller = await Seller.findOne({ user: user._id });

    if (
      !seller ||
      seller.loginCode !== otp ||
      seller.loginCodeExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    seller.loginCode = null;
    seller.loginCodeExpiresAt = null;
    await seller.save();

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "5h" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      message: "Seller login successful",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= 🔥 RESEND USER VERIFICATION ================= */

exports.resendUserVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const otpCode = generateCode();
    user.verificationCode = otpCode;
    user.verificationCodeExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      {
        subject: "Email Verification - QuickCart",
        username: user.username,
        verificationCode: otpCode,
      },
      "auth/verification.hbs"
    );

    return res.status(200).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= 🔥 RESEND SELLER OTP ================= */

exports.sendVerificationCodeAgain = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    const seller = await Seller.findOne({ user: user._id });

    const otpCode = generateCode();
    seller.loginCode = otpCode;
    seller.loginCodeExpiresAt = Date.now() + 10 * 60 * 1000;
    await seller.save();

    await sendEmail(
      seller.businessEmail,
      {
        subject: "Seller Login OTP - QuickCart",
        username: seller.businessName,
        verificationCode: otpCode,
      },
      "seller/loginVerification.hbs"
    );

    return res.status(200).json({
      status: "success",
      message: "Seller OTP sent again",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= LOGOUT ================= */

exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};