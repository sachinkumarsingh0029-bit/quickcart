/* ================= 🔥 RESEND SELLER OTP ================= */

exports.sendVerificationCodeAgain = async (req, res) => {
  const { email } = req.body;

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
      status: "success",
      message: "OTP sent again successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
};