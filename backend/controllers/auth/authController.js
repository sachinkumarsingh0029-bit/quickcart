const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../../models/auth/userSchema");
const Seller = require("../../models/seller/sellerSchema");
const handleError = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendEmail");
const generateCode = require("../../utils/generateCode");
const { v4: uuidv4 } = require("uuid");

/* =====================================
   COOKIE OPTIONS (CROSS DOMAIN FIX)
===================================== */

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 5 * 60 * 60 * 1000,
};

/* =====================================
   SIGNUP
===================================== */

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

/* =====================================
   LOGIN (WITH SELLER OTP)
===================================== */

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

    /* ===============================
       SELLER LOGIN FLOW
    =============================== */

    if (user.role === "seller") {
      const seller = await Seller.findOne({ user: user._id });

      if (!seller) {
        return handleError(res, {
          message: "Seller profile not found",
          status: 404,
        });
      }

      const otpCode = generateCode();
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      seller.loginCode = otpCode;
      seller.loginCodeExpiresAt = expiry;
      await seller.save();

      // Send OTP email
      await sendEmail(
        seller.businessEmail,
        {
          subject: "Seller Login OTP - QuickCart",
          username: seller.businessName,
          otp: otpCode,
        },
        "./seller/loginVerification.hbs"
      );

      return res.status(200).json({
        role: "seller",
        message: "OTP sent to seller email",
        status: "otp_required",
      });
    }

    /* ===============================
       NORMAL USER LOGIN
    =============================== */

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        address: user.address,
        verificationStatus: user.verificationStatus,
        role: user.role,
        number: user.number,
      },
      status: "success",
    });
  } catch (err) {
    return handleError(res, {
      message: "Invalid Credentials",
      status: 401,
      code: "authentication_failed",
    });
  }
};

/* =====================================
   VERIFY SELLER OTP
===================================== */

exports.verifySellerOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "seller") {
      return res.status(400).json({
        status: "error",
        message: "Invalid seller account",
      });
    }

    const seller = await Seller.findOne({ user: user._id });

    if (
      seller.loginCode !== otp ||
      seller.loginCodeExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    seller.loginCode = "";
    seller.loginCodeExpiresAt = null;
    await seller.save();

    const token = await user.generateAuthToken();
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      status: "success",
      message: "Seller login successful",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* =====================================
   GET USER
===================================== */

exports.getUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    res.status(200).json({
      user,
      status: "success",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

/* =====================================
   LOGOUT
===================================== */

exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};