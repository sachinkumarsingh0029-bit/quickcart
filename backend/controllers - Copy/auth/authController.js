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
  secure: true,           // 🔥 REQUIRED FOR HTTPS (Render)
  sameSite: "none",       // 🔥 REQUIRED FOR Vercel → Render
  maxAge: 5 * 60 * 60 * 1000,
};

/* ================= SIGNUP ================= */

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, {
      code: "CustomValidationError",
      status: "error",
      errors: errors.array(),
    });
  }

  const { email, password, username } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return handleError(res, {
        code: "already_exists",
        status: "error",
        message: "User already exists",
      });
    }

    user = new User({ email, password, username });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ status: "success" });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, {
      code: "CustomValidationError",
      status: "error",
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const { token, user } = await User.findByCredentials(email, password);

    if (!user) {
      return handleError(res, {
        message: "Invalid Credentials",
        status: 401,
        code: "authentication_failed",
      });
    }

    /* ===== SELLER LOGIN FLOW ===== */

    if (user.role === "seller") {
      const seller = await Seller.findOne({ user: user._id });

      if (!seller) {
        return res.status(404).json({
          status: "error",
          message: "Seller profile not found",
        });
      }

      const otpCode = generateCode();
      const expiry = Date.now() + 10 * 60 * 1000;

      seller.loginCode = otpCode;
      seller.loginCodeExpiresAt = expiry;
      await seller.save();

      const verificationLink =
        "https://quickcart-5uy5.vercel.app/login/" + seller.businessEmail;

      await sendEmail(
        seller.businessEmail,
        {
          subject: "Seller Login - QuickCart",
          username: seller.businessName,
          verificationCode: otpCode,
          verificationLink: verificationLink,
        },
        "seller/loginVerification.hbs"
      );

      return res.status(200).json({
        role: "seller",
        message: "Check your email for OTP login.",
        status: "success",
      });
    }

    /* ===== NORMAL USER LOGIN ===== */

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    return handleError(res, {
      message: "Invalid Credentials",
      status: 401,
      code: "authentication_failed",
    });
  }
};

/* ================= VERIFY SELLER LOGIN ================= */

exports.verifySellerLogin = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "seller") {
      return res.status(400).json({
        status: "error",
        message: "Invalid seller account",
      });
    }

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      return res.status(404).json({
        status: "error",
        message: "Seller not found",
      });
    }

    if (
      seller.loginCode !== otp ||
      seller.loginCodeExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Password",
      });
    }

    seller.loginCode = "";
    seller.loginCodeExpiresAt = null;
    await seller.save();

    const token = await user.generateAuthToken();

    // 🔥 IMPORTANT
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      message: "Seller login successful",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* ================= LOGOUT ================= */

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};