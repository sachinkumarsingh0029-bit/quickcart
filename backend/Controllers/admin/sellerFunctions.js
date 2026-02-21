const { validationResult } = require('express-validator');

const User = require('../../Models/auth/userSchema');
const Seller = require('../../Models/seller/sellerSchema');
const applySeller = require('../../Models/seller/applySellerSchema');
const sendEmail = require('../../utils/sendEmail');
const handleError = require('../../utils/errorHandler');
const generateCode = require('../../utils/generateCode');
const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');
const customLogger = require('../../utils/logHandler');

// Get applied sellers
const getAllApplySellers = async (req, res, next) => {
    try {
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }
        const applySellers = await applySeller.find(); // populate the user field with only fullName and email

        res.status(200).json({
            success: true,
            message: 'All apply sellers retrieved successfully',
            sellers: applySellers,
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// get applied seller by id
const getApplySellerById = async (req, res, next) => {
    try {
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }

        const sellerId = req.params.sellerId;
        const seller = await applySeller.findById(sellerId).populate({ path: 'user', select: '-tokens -orders -tickets -wishlist -cart -password' });

        res.status(200).json({
            success: true,
            message: 'Seller retrieved successfully',
            seller: seller,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// Accept seller
const acceptSeller = async (req, res, next) => {
    customLogger(req.user.role, "Aceept seller", req)
    try {
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }
        // Find the seller application to be approved
        const newSellerApplication = await applySeller.findById(req.params.sellerId);

        if (!newSellerApplication) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller application not found',
            });
        }

        // Create a new seller instance with required fields
        const newSeller = new Seller({
            businessUsername: newSellerApplication.businessUsername,
            businessNumber: newSellerApplication.businessNumber,
            businessEmail: newSellerApplication.businessEmail,
            businessName: newSellerApplication.businessName,
            businessRegistrationNumber: newSellerApplication.businessRegistrationNumber,
            businessType: newSellerApplication.businessType,
            businessAddress: newSellerApplication.businessAddress,
            businessWebsite: newSellerApplication.businessWebsite,
            taxIDNumber: newSellerApplication.taxIDNumber,
            productCategories: newSellerApplication.productCategories,
            user: newSellerApplication.user._id,
        });

        // Save the new seller instance to the database
        await newSeller.save();

        // Remove the seller application from the applySellerSchema
        newSellerApplication.status = "Approved";
        await newSellerApplication.save();

        // Update user in the application
        const user = await User.findById(newSeller.user._id);
        user.seller = newSeller._id;
        user.role = "seller";
        await user.save();

        const verificationCode = generateCode();
        const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        newSeller.verificationCode = verificationCode;
        newSeller.verificationCodeExpiresAt = codeExpiry;
        await newSeller.save();

        res.status(200).json({
            status: "success",
            message: 'Seller account created successfully'
        });

        const data = {
            subject: 'New Seller Account - QuickCart',
            username: newSeller.businessName,
            verificationCode: newSeller.verificationCode,
            verificationLink: `http://localhost:3001/verify/${newSeller.businessEmail}`
        };

        await sendEmail(newSeller.businessEmail, data, './verification/verifySeller.hbs');

    } catch (error) {
        console.log(error)
        return handleError(res, error);
    }
};

// reject seller
const rejectSeller = async (req, res, next) => {
    customLogger(req.user.role, "reject seller", req)
    try {
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }
        // Find the seller application to be approved
        const newSellerApplication = await applySeller.findById(req.params.sellerId);

        if (!newSellerApplication) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller application not found',
            });
        }

        // Remove the seller application from the applySellerSchema
        newSellerApplication.status = "Rejected";
        await newSellerApplication.save();

        res.status(200).json({
            status: "success",
            message: 'Seller request rejected successfully',
            subject: 'New Seller Account Request Rejected - QuickCart'
        });

        // Update user in the application
        const user = await User.findById(newSellerApplication.user._id);

        const data = {
            subject: 'New Seller Account Rejected - QuickCart',
            username: user.username,
            reason: req.body.reason
        };

        await sendEmail(user.email, data, './seller/rejectSeller.hbs');

    } catch (error) {
        return handleError(res, error);
    }
}

// Get All Verfied sellers
const getAllSellers = async (req, res, next) => {
    try {
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }

        const sellers = await Seller.find({}).populate('user', 'fullName email'); // populate the user field with only fullName and email

        res.status(200).json({
            success: true,
            message: 'sellers retrieved successfully',
            sellers: sellers,
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// Create a new seller
const createSeller = async (req, res) => {
    customLogger(req.user.role, "create seller", req)
    const errors = validationResult(req);

    const result = authorizeChangeMiddleware("seller", req, res);
    if (result === -1) {
        return;
    }

    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        let seller = await Seller.findOne({ businessEmail: req.body.businessEmail });
        if (seller) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'Seller already exists',
            });
        }

        const {
            businessUsername,
            businessName,
            businessNumber,
            businessEmail,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            paymentPreferences,
            blockchainWalletAddress,
            paypalAccountEmailAddress,
            productCategories
        } = req.body;

        seller = new Seller({
            businessUsername,
            businessEmail,
            businessNumber,
            businessName,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            paymentPreferences,
            blockchainWalletAddress,
            paypalAccountEmailAddress,
            productCategories,
            user: user._id
        });

        await seller.save();
        user.seller = seller._id;
        await user.save();
        const data = {
            newSeller: {
                businessUsername: seller.businessUsername,
                email: seller.businessEmail
            },
            subject: 'New Seller Account - QuickCart'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

        res.status(200).json({ status: 'success', message: 'Seller created', seller });
    } catch (err) {
        return handleError(res, err);
    }

};

// Get a single seller
const getSellerById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }

        const seller = await Seller.findById(id);
        if (!seller) {
            res.status(400).json({ status: 'error', message: "seller not found" });
        }
        res.status(200).json({ status: 'success', message: 'Seller retrieved', seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update seller
const updateSeller = async (req, res) => {
    customLogger(req.user.role, "update seller", req)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }
        const { id } = req.params;

        // check if seller exists
        const seller = await Seller.findById(id);
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        // update seller information
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

        if (businessEmail) seller.businessEmail = businessEmail;
        if (businessNumber) seller.businessNumber = businessNumber;
        if (businessName) seller.businessName = businessName;
        if (businessUsername) seller.businessUsername = businessUsername;
        if (businessLogo) seller.businessLogo = businessLogo;
        if (businessRegistrationNumber) seller.businessRegistrationNumber = businessRegistrationNumber;
        if (businessType) seller.businessType = businessType;
        if (businessAddress) seller.businessAddress = businessAddress;
        if (businessWebsite) seller.businessWebsite = businessWebsite;
        if (taxIDNumber) seller.taxIDNumber = taxIDNumber;
        if (productCategories) seller.productCategories = productCategories;

        await seller.save();

        res.status(200).json({ status: 'success', message: 'Seller updated successfully' });

        const data = {
            sellerUpdated: {
                name: seller.businessName,
                email: seller.businessEmail
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.username,
            },
            subject: 'Seller Updated - QuickCart'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

// Delete seller
const deleteSeller = async (req, res) => {
    customLogger(req.user.role, "delete seller", req)
    try {
        const { id } = req.params;
        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }
        const seller = await Seller.findByIdAndDelete(id);

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }
        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });

        const data = {
            sellerDeleted: {
                name: seller.businessUsername,
                email: seller.businessEmail
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.username,
            },
            subject: 'Seller Account Deleted - QuickCart'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

// ban seller
const banSeller = async (req, res) => {
    customLogger(req.user.role, "ban seller", req)
    try {
        const { id } = req.params;
        const seller = await Seller.findById(id);

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const result = authorizeChangeMiddleware("seller", req, res);
        if (result === -1) {
            return;
        }

        seller.banStatus.isBanned = true;
        seller.banStatus.banExpiresAt = req.body.expiresAt;
        await seller.save();

        res.status(200).json({ status: 'success', message: 'Seller has been banned successfully' });

        const data = {
            userBanned: {
                name: seller.businessUsername,
                email: seller.businessEmail,
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.username,
            },
            subject: 'Account banned - QuickCart'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/userTerms.hbs');
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { rejectSeller, getApplySellerById, banSeller, getSellerById, getAllApplySellers, acceptSeller, getAllSellers, createSeller, updateSeller, deleteSeller }