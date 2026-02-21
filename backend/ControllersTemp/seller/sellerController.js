const { validationResult } = require("express-validator");

const Seller = require("../../models/seller/sellerSchema");
const applyForSellerModel = require("../../models/seller/applySellerSchema");
const Product = require("../../models/product/productSchema");
const Order = require("../../models/order/orderSchema");
const sendEmail = require("../../utils/sendEmail");

const handleError = require("../../utils/errorHandler");
const { default: mongoose } = require("mongoose");
const User = require("../../models/auth/userSchema");
const bcrypt = require("bcryptjs");
const RefundRequest = require("../../models/transaction/refundRequestSchema");
const customLogger = require("../../utils/logHandler");
const generateCode = require("../../utils/generateCode");

// Apply for seller account
const applyForSellerAccount = async (req, res, next) => {
  try {
    customLogger("user", "Applied for seller", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, {
        code: "CustomValidationError",
        status: "error",
        errors: errors.array(),
      });
    }
    // Extract required fields from request body
    const {
      businessNumber,
      businessName,
      businessEmail,
      businessUsername,
      businessRegistrationNumber,
      businessType,
      businessAddress,
      businessWebsite,
      taxIDNumber,
      productCategories,
    } = req.body;

    // Check if there is already an existing seller with the same business email or business username
    const existingSeller = await Seller.findOne({
      $or: [
        { businessEmail: businessEmail },
        { businessUsername: businessUsername },
        { businessRegistrationNumber: businessRegistrationNumber },
        { taxIDNumber: taxIDNumber },
        { user: req.user._id },
      ],
    });

    if (existingSeller) {
      let errorMessage = "There is already an existing seller with the same ";
      if (existingSeller.businessEmail === businessEmail) {
        errorMessage += "Business Email";
      } else if (existingSeller.businessUsername === businessUsername) {
        errorMessage += "Business Username";
      } else if (
        existingSeller.businessRegistrationNumber === businessRegistrationNumber
      ) {
        errorMessage += "Business Registration Number";
      } else if (existingSeller.taxIDNumber === taxIDNumber) {
        errorMessage += "tax ID number";
      } else if (
        existingSeller.user._id.toString() === req.user._id.toString()
      ) {
        errorMessage += "User Account";
      } else {
        errorMessage +=
          "email or username or Business registration number or tax ID number or user account";
      }

      if (!errorMessage.includes("User Account")) {
        errorMessage += " already exists";
      }
      return handleError(res, {
        code: "already_exists",
        status: "error",
        message: errorMessage,
      });
    }

    // Create a new seller instance with required fields
    const newSeller = new applyForSellerModel({
      businessNumber,
      businessEmail,
      businessUsername,
      businessName,
      businessRegistrationNumber,
      businessType,
      businessAddress,
      businessWebsite,
      taxIDNumber,
      productCategories,
      user: req.user._id, // Link the seller account to the current user
    });

    // Save the new seller instance to the database
    await newSeller.save();

    res.status(200).json({
      status: "success",
      message: "successfully applied for seller account",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Verify a seller
const verifySeller = async (req, res) => {
  customLogger("seller", "Verify Seller", req);
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, {
      code: "CustomValidationError",
      status: "error",
      errors: errors.array(),
    });
  }
  const { code, businessLogo } = req.body;

  try {
    // Find the seller by the verification code
    const seller = await Seller.findOne({
      email: req.body.email,
      verificationStatus: false,
    });
    console.log(seller);
    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    if (!seller.verificationStatus) {
      // Check if the verification code is not expired
      if (seller.verificationCodeExpiresAt < Date.now()) {
        // If expired, generate a new code and send an email with the new code
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
        seller.verificationCode = newVerificationCode;
        seller.verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set new code expiry to 24 hours
        await seller.save();

        const data = {
          username: seller.fullName,
          verificationCode: seller.verificationCode,
          verificationLink: "https://example.com/verify",
          subject: "Verify seller account - QuickCart",
        };

        await sendEmail(
          seller.email,
          data,
          "./verfication/verficationCode.hbs"
        );

        res
          .status(200)
          .json({ status: "success", message: "Verification code sent" });
      } else {
        if (seller.verificationCode === code) {
          seller.businessLogo = businessLogo;
          seller.verificationStatus = true;
          seller.verificationCode = null;
          seller.verificationCodeExpiresAt = null;

          const verificationCode = generateCode();
          const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

          seller.loginCode = verificationCode;
          seller.loginCodeExpiresAt = codeExpiry;
          await seller.save();

          const data1 = {
            subject: "Seller Login - QuickCart",
            username: seller.businessName,
            verificationCode: seller.loginCode,
            verificationLink: `/login/${seller.businessEmail}`,
          };

          res.status(200).json({
            status: "success",
            message: "Seller account verified successfully",
            login: `/login/${seller.businessEmail}`,
          });

          await sendEmail(
            seller.businessEmail,
            data1,
            "./seller/loginVerification.hbs"
          );
        } else {
          return res.status(412).json({
            message: "Invalid or expired verification code",
            status: "success",
          });
        }
      }
      // Send a success response
    } else {
      res
        .status(411)
        .json({ status: "error", message: "Seller account already verified" });
    }
  } catch (err) {
    console.log(err);
    return handleError(res, err);
  }
};

// seller login
const loginSeller = async (req, res) => {
  customLogger("seller", "Seller login", req);
  try {
    // Find the seller by the verification code
    const seller = await Seller.findOne({ businessEmail: req.params.email });
    const code = req.body.code;
    const password = req.body.password;

    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    if (seller.loginCodeExpiresAt < Date.now()) {
      res
        .status(400)
        .json({ status: "error", message: "Verification code expired" });
    } else {
      if (seller.loginCode === code) {
        const user = await User.findById(seller.user);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res
            .status(499)
            .json({ status: "error", message: "Invalid credentials" });
        } else {
          // Always generate a new token for seller login to ensure it's valid
          const token = await user.generateAuthToken();
          res.cookie("token", token, {
            httpOnly: true, // cookie cannot be accessed from client-side scripts
            secure: process.env.NODE_ENV === "production", // cookie should only be sent over HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // cookie should only be sent for same-site requests
            maxAge: 5 * 60 * 60 * 1000, // 5hr
          });
          seller.loginCode = null;
          seller.loginCodeExpiresAt = null;
          await seller.save();
          return res.status(200).json({
            status: "success",
            seller: seller,
            user: {
              id: user.id,
              code: user.name,
              email: user.email,
              username: user.username,
              address: user.address,
              verificationStatus: user.verificationStatus,
              role: user.role,
            },
          });
        }
      } else {
        return res.status(412).json({
          message: "Invalid or expired verification code",
          status: "error",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return handleError(res, err);
  }
};

// check verification code
const checkVerificationCode = async (req, res) => {
  try {
    customLogger("seller", "Check Verification Code", req);
    const email = req.params.email;
    
    // Try to find seller by businessEmail first
    let seller = await Seller.findOne({ businessEmail: email });
    
    // If not found by businessEmail, try to find by user's email
    if (!seller) {
      const User = require('../models/auth/userSchema');
      const user = await User.findOne({ email: email, role: 'seller' });
      if (user && user.seller) {
        seller = await Seller.findById(user.seller);
      }
    }

    if (!seller) {
      return res.status(200).json({ 
        status: "deny",
        message: "Seller not found with this email address. Please make sure you're using the correct email."
      });
    }

    // Check if seller is verified
    if (!seller.verificationStatus) {
      return res.status(200).json({ 
        status: "deny",
        message: "Seller account not verified. Please verify your account first."
      });
    }

    // Check if login code exists and is valid
    if (
      !seller.loginCode ||
      seller.loginCode === null ||
      seller.loginCode === "" ||
      !seller.loginCodeExpiresAt ||
      seller.loginCodeExpiresAt < Date.now()
    ) {
      return res.status(200).json({ 
        status: "deny",
        message: "Login code expired or not found. Please login through the regular login page (http://localhost:3000/login) to receive a new code."
      });
    } else {
      return res.status(200).json({ status: "allow" });
    }
  } catch (err) {
    console.error("Error in checkVerificationCode:", err);
    return res.status(200).json({ 
      status: "deny",
      message: "Error checking login status"
    });
  }
};

// Get a seller by ID
const getSellerProfile = async (req, res) => {
  try {
    res.status(200).json({ status: "success", data: req.seller });
  } catch (err) {
    return handleError(res, err);
  }
};

// Update a seller by ID
const updateSellerById = async (req, res) => {
  const errors = validationResult(req);
  customLogger("seller", "Update Profile", req);
  if (!errors.isEmpty()) {
    return handleError(res, {
      code: "CustomValidationError",
      status: "error",
      errors: errors.array(),
    });
  }
  try {
    let seller = req.seller;

    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    const {
      businessUsername,
      businessEmail,
      businessRegistrationNumber,
      businessNumber,
      businessName,
      businessLogo,
      businessType,
      businessWebsite,
      taxIDNumber,
      productCategories,
      businessAddress,
    } = req.body;

    const sellerFields = {};
    if (businessEmail) sellerFields.businessEmail = businessEmail;
    if (businessNumber) sellerFields.businessNumber = businessNumber;
    if (businessName) sellerFields.businessName = businessName;
    if (businessUsername) sellerFields.businessUsername = businessUsername;
    if (businessLogo) sellerFields.businessLogo = businessLogo;
    if (businessRegistrationNumber)
      sellerFields.businessRegistrationNumber = businessRegistrationNumber;
    if (businessType) sellerFields.businessType = businessType;
    if (businessAddress) sellerFields.businessAddress = businessAddress;
    if (businessWebsite) sellerFields.businessWebsite = businessWebsite;
    if (taxIDNumber) sellerFields.taxIDNumber = taxIDNumber;
    if (productCategories) sellerFields.productCategories = productCategories;

    if (toString(seller.user._id) !== toString(req.user._id)) {
      return handleError(res, {
        code: "unauthorized_access",
        status: "error",
        message: "Unauthorized Access",
      });
    }

    seller = await Seller.findByIdAndUpdate(
      seller._id,
      { $set: sellerFields },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Seller updated successfully",
      seller: seller,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// Delete a seller by ID
const deleteSellerById = async (req, res) => {
  try {
    customLogger("seller", "delete seller profile", req);
    const seller = req.seller;
    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    await Seller.deleteOne({ _id: seller._id });
    req.user.role = "user";
    await req.user.save();

    const data = {
      username: seller.fullName,
      subject: "Seller account deleted - QuickCart",
    };

    await sendEmail(
      seller.businessEmail,
      data,
      "./userActions/sellerAccountDeleted.hbs"
    );

    res
      .status(200)
      .json({ status: "success", message: "Seller deleted successfully" });
  } catch (err) {
    return handleError(res, err);
  }
};

// Create product for seller
const createProductForSeller = async (req, res, next) => {
  try {
    customLogger("seller", "new product created", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, {
        code: "CustomValidationError",
        status: "error",
        errors: errors.array(),
      });
    }

    const seller = req.seller;

    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    const product = new Product({
      seller: seller._id,
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      imagesUrl: req.body.imagesUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      model3dUrl: req.body.model3dUrl || null,
      tags: req.body.tags,
      discountedPrice: req.body.discountedPrice,
      faqs: req.body.faqs,
      updatedBy: {
        role: req.user.role,
        userId: req.user._id,
      },
    });
    await product.save();

    // Update seller's products array
    seller.productListings.push(product._id);
    await seller.save();

    res.status(200).json({
      status: "success",
      message: "Created a new product",
      _id: product._id,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// get seller products
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id }).sort({
      views: -1,
    });
    res.status(200).json({ status: "success", products: products });
  } catch (err) {
    return handleError(res, err);
  }
};

// Update product for seller
const updateProductForSeller = async (req, res) => {
  try {
    customLogger("seller", "update product", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, {
        code: "CustomValidationError",
        status: "error",
        errors: errors.array(),
      });
    }

    const seller = req.seller;
    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    }

    const product = await Product.findOne({
      _id: req.body.productId,
      seller: seller._id,
    });
    if (!product) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Product not found",
      });
    }

    product.productName = req.body.productName;
    product.productDescription = req.body.productDescription;
    product.price = req.body.price;
    product.discountedPrice = req.body.discountedPrice;
    product.quantity = req.body.quantity;
    product.category = req.body.category;
    product.imagesUrl = req.body.imagesUrl;
    product.thumbnailUrl = req.body.thumbnailUrl;
    product.model3dUrl = req.body.model3dUrl || null;
    product.tags = req.body.tags;
    product.faqs = req.body.faqs;
    product.keywords = req.body.keywords;
    product.updatedBy = {
      role: req.user.role,
      userId: req.user._id,
    };

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error);
    return handleError(res, error);
  }
};

// DELETE a product of a seller
const deleteProductForSeller = async (req, res) => {
  try {
    customLogger("seller", "delete product", req);
    const product = await Product.findOneAndDelete({
      _id: req.body._id,
      seller: req.seller._id,
    });
    if (!product) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Deleted the product",
    });

    const data = {
      username: product.seller.businessUsername,
      productName: product.productName,
      subject: "Product Deleted - QuickCart",
    };

    await sendEmail(
      product.seller.businessEmail,
      data,
      "./userActions/deletedProduct.hbs"
    );
  } catch (err) {
    return handleError(res, err);
  }
};

// get dashboard data
const getDashboardData = async (req, res) => {
  try {
    let sellerId = req.seller?._id || req.user?.seller;
    
    if (!sellerId) {
      return res.status(400).json({ 
        status: "error",
        message: "Seller ID not found" 
      });
    }

    // Convert to ObjectId if it's a string
    if (typeof sellerId === 'string') {
      sellerId = new mongoose.Types.ObjectId(sellerId);
    }

    const { from, to } = req.query;

    const today = new Date();
    const startDate = from
      ? new Date(from)
      : new Date(today.getFullYear(), today.getMonth(), 2);
    const endDate = to
      ? new Date(to)
      : new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const orderTotal = await Order.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$orderTotal" },
          count: { $sum: 1 },
        },
      },
    ]);

    const newCustomers = await Order.distinct("customer", {
      seller: sellerId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const returningCustomers = await Order.distinct("customer", {
      seller: sellerId,
      createdAt: { $lt: startDate },
    });

    const retentionRate =
      returningCustomers.length > 0
        ? ((newCustomers.length / returningCustomers.length) * 100).toFixed(2)
        : 0;

    const totalOrders = await Order.countDocuments({
      seller: sellerId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const newCustomersThisMonth = newCustomers.filter(
      (customer) => !returningCustomers.includes(customer)
    );

    const avgOrderValue =
      orderTotal.length > 0 && orderTotal[0].total
        ? (orderTotal[0].total / totalOrders).toFixed(2)
        : 0;

    const avgOrderSize =
      orderTotal.length > 0 && orderTotal[0].count
        ? (orderTotal[0].count / totalOrders).toFixed(0)
        : 0;

    const productListings = await Product.aggregate([
      {
        $match: {
          seller: sellerId,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const conversionRate =
      totalOrders > 0 && productListings.length > 0 && productListings[0].totalViews > 0
        ? ((totalOrders / productListings[0].totalViews) * 100).toFixed(2)
        : 0;

    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product",
          totalSales: { $sum: "$products.price" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          "product.productlistings._id": 0,
          "product.productlistings.__v": 0,
          "product.productlistings.createdAt": 0,
          "product.productlistings.updatedAt": 0,
        },
      },
      {
        $sort: {
          totalSales: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      orderTotal: orderTotal.length > 0 ? orderTotal[0].total : 0,
      newCustomers: newCustomersThisMonth.length,
      returningCustomers: returningCustomers.length,
      retentionRate: retentionRate,
      totalOrders: totalOrders,
      avgOrderValue: avgOrderValue,
      avgOrderSize: avgOrderSize,
      conversionRate: conversionRate,
      totalViews:
        productListings.length > 0 ? productListings[0].totalViews : 0,
      topSellingProducts: topSellingProducts,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return handleError(res, {
      code: "server_error",
      status: "error",
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

// get sales data
const getSalesData = async (req, res) => {
  try {
    customLogger("seller", "get sales data", req);
    
    // Get seller ID - prefer req.seller._id, fallback to req.user.seller
    let sellerId = req.seller?._id || req.user?.seller;
    
    if (!sellerId) {
      console.error("Seller ID not found in request:", {
        hasSeller: !!req.seller,
        hasUser: !!req.user,
        userSeller: req.user?.seller
      });
      return res.status(400).json({ 
        status: "error",
        message: "Seller ID not found. Please ensure you are logged in as a seller." 
      });
    }

    // Convert to ObjectId if it's a string
    if (typeof sellerId === 'string') {
      sellerId = new mongoose.Types.ObjectId(sellerId);
    } else if (sellerId && sellerId.toString) {
      // If it's already an ObjectId, ensure it's the right type
      sellerId = sellerId;
    }

    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const firstDayOfSixMonthsAgo = new Date(
      sixMonthsAgo.getFullYear(),
      sixMonthsAgo.getMonth(),
      1
    );

    const salesData = await Order.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: firstDayOfSixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: "$orderTotal" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          sales: "$sales",
          count: "$count",
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    const labels = [];
    const sales = [];
    const counts = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(date);
      const year = date.getFullYear();
      const monthData = salesData.find(
        (d) => d.month === date.getMonth() + 1 && d.year === year
      );
      labels.unshift(`${monthName} ${year}`);
      sales.unshift(monthData ? monthData.sales : 0);
      counts.unshift(monthData ? monthData.count : 0);
    }

    res.status(200).json({
      status: "success",
      labels,
      sales,
      counts,
    });
  } catch (error) {
    console.error("Error in getSalesData:", error);
    console.error("Error stack:", error.stack);
    return handleError(res, {
      code: "server_error",
      status: "error",
      message: "Error fetching sales data",
      error: error.message
    });
  }
};

// get orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.seller }).sort({
      createdAt: -1,
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// get refund requests
const getRefundRequest = async (req, res, next) => {
  try {
    const refundRequest = await RefundRequest.find({
      seller: req.seller._id,
    }).sort({ createdAt: -1 });
    if (!refundRequest) {
      return res.status(404).json({
        message: `Refund request not found for seller ${req.seller._id}`,
      });
    }
    res.status(200).json({ status: "success", refundRequest });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// get refund request by id
const getRefundRequestById = async (req, res, next) => {
  try {
    const refundId = req.params.refundId;
    const refundRequest = await RefundRequest.findById(refundId)
      .populate("orderId")
      .populate({
        path: "orderId",
        populate: { path: "products.product", select: "-__v" },
      })
      .populate("customer")
      .select("-token -password -tickets")
      .populate("transactionId");

    if (!refundRequest) {
      return res.status(404).json({
        message: `Refund request not found for id ${refundId}`,
      });
    }
    res.status(200).json({ status: "success", refundRequest });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// update refund status
const updateRefundRequestStatus = async (req, res) => {
  try {
    const { refundId } = req.params;
    const { status } = req.body;

    customLogger(
      "seller",
      `Refund status update:- ${status} - ${refundId}`,
      req
    );

    // Check if the status is valid
    if (
      !["Approved", "Rejected", "Seller Received Products"].includes(status)
    ) {
      return res.status(499).json({ message: "Invalid status" });
    }

    // Find the refund request by ID and update the status
    const refundRequest = await RefundRequest.findByIdAndUpdate(
      refundId,
      { status },
      { new: true }
    ).populate("customer");

    // Check if the refund request exists
    if (!refundRequest) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    if (status === "Rejected") {
      await Order.findByIdAndUpdate(
        refundRequest.orderId,
        { orderStatus: "Confirmed" },
        { new: true }
      );
    }

    // Return the updated refund request
    res.json({
      message: "Refund request status updated successfully",
    });

    const data = {
      customerName: refundRequest.customer.username,
      transactionId: refundRequest.transactionId,
      orderId: refundRequest.orderId,
      status: refundRequest.status,
      reason: refundRequest.reason,
      amount: refundRequest.amount,
      subject: "Refund Request Update - QuickCart",
      seller: req.seller.businessName,
    };

    await sendEmail(
      refundRequest.customer.email,
      data,
      "./order/refundStatusUpdate.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrdersById = async (req, res) => {
  try {
    const id = req.params.orderId;
    const order = await Order.find({ orderId: id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { _id, newStatus } = req.body;

  try {
    customLogger("seller", `Order status update:- ${newStatus} - ${_id}`, req);
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      { orderStatus: newStatus },
      { new: true }
    ).populate("products.product");
    console.log(updateOrderStatus);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const acceptOrder = async (req, res) => {
  const { _id } = req.body;

  try {
    customLogger("seller", `Accept Order - ${_id}`, req);
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      { orderStatus: "Confirmed" },
      { new: true }
    ).populate(["customer", "products.product"]);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order accepted successfully", order: updatedOrder });

    const data = {
      order: updatedOrder,
      subject: "Order Confirmed - QuickCart",
    };

    await sendEmail(
      updatedOrder.customer.email,
      data,
      "./seller/confirmedOrder.hbs"
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const cancelOrder = async (req, res) => {
  const { _id, reason } = req.body;

  try {
    customLogger("seller", `Cancel Order - ${reason} - ${_id}`, req);
    const updatedOrder = await Order.findById(_id).populate("customer");
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    updatedOrder.orderStatus = "Cancelled";
    updatedOrder.notes.cancelOrderReason = reason;
    await updatedOrder.save();
    // Create and save a new refund request
    const refundRequest = new RefundRequest({
      transactionId: updatedOrder.transactionId,
      reason: reason,
      amount: updatedOrder.orderTotal,
      seller: updatedOrder.seller,
      customer: updatedOrder.customer,
      status: "Pending",
      orderId: updatedOrder._id,
    });
    await refundRequest.save();

    const data = {
      orderNumber: updatedOrder._id,
      reason: reason,
      subject: "Order Cancelled - QuickCart",
    };

    await sendEmail(
      updatedOrder.customer.email,
      data,
      "./seller/cancelOrder.hbs"
    );

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const addTrackingDetails = async (req, res) => {
  const {
    _id,
    carrierName,
    trackingNumber,
    trackingUrl,
    deliveryDate,
    deliveryStatus,
  } = req.body;

  try {
    // Check if tracking details with given ID exists
    const orderDetails = await Order.findById(_id).populate("products.product");
    if (!orderDetails) {
      return res.status(404).json({ error: "Tracking details not found" });
    }

    // Update tracking details
    orderDetails.trackingDetails.carrierName =
      carrierName || orderDetails.trackingDetails.carrierName;
    orderDetails.trackingDetails.trackingNumber =
      trackingNumber || orderDetails.trackingDetails.trackingNumber;
    orderDetails.trackingDetails.trackingUrl =
      trackingUrl || orderDetails.trackingDetails.trackingUrl;
    orderDetails.trackingDetails.deliveryDate =
      deliveryDate || orderDetails.trackingDetails.deliveryDate;
    orderDetails.trackingDetails.deliveryStatus =
      deliveryStatus || orderDetails.trackingDetails.deliveryStatus;

    // Save updated tracking details to database
    await orderDetails.save();

    console.log(orderDetails);

    return res.status(200).json({
      message: "Tracking details updated successfully",
      order: orderDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET a product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Product not found",
      });
    }
    // Send the response to the client
    res.status(200).json({
      status: "success",
      product: product,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  updateRefundRequestStatus,
  getRefundRequestById,
  getRefundRequest,
  checkVerificationCode,
  getProductById,
  getSellerProducts,
  acceptOrder,
  addTrackingDetails,
  cancelOrder,
  updateOrderStatus,
  getOrdersById,
  loginSeller,
  getOrders,
  getSalesData,
  getDashboardData,
  getSellerProfile,
  updateSellerById,
  deleteSellerById,
  deleteProductForSeller,
  updateProductForSeller,
  createProductForSeller,
  applyForSellerAccount,
  verifySeller,
};
