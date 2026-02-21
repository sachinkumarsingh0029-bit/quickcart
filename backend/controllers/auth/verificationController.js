const User = require('../../models/auth/userSchema');
const sendEmail = require('../../utils/sendEmail');
const generateVerificationCode = require('../../utils/generateCode');

const handleError = require('../../utils/errorHandler');
const errorCode = require('../../data/errorCode');

const sendVerificationCode = async (res, email) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error({
                code: 'not_found',
                status: 'error',
                message: 'User not found'
            });
        }
        if (!user.verificationStatus) {
            const verificationCode = generateVerificationCode();
            const codeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

            // Save verification code and expiry time to user document
            user.verificationCode = verificationCode;
            user.verificationCodeExpiresAt = codeExpiry;
            await user.save();

            const data = {
                username: user.username,
                verificationCode: user.verificationCode,
                verificationLink: 'https://example.com/verify',
                subject: 'Verification code - QuickCart'
            };

            // Send email
            await sendEmail(user.email, data, './verification/verificationCode.hbs');

            return { success: true, message: 'Verification code sent successfully.', status: 200 };
        } else {
            return res.status(411).send({ status: 'error', message: 'User is already verified.' });
        }
    } catch (err) {
        throw new Error({
            error: errorCode.SERVER_ERROR.code,
            message: errorCode.SERVER_ERROR.message,
            status: 500
        });
    }
};

const verifyUser = async (email, verificationCode) => {
    try {
        // Check if user exists and code has not expired
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error({
                code: 'not_found',
                status: 'error',
                message: 'User not found'
            });
        }
        if (user.verificationStatus) {
            user.verificationStatus = true;
            user.verificationCode = "";
            user.verificationCodeExpiresAt = "";
            await user.save();
            return { success: false, message: 'User is already verified.', status: 500 };
        }
        if (user.codeExpiry < Date.now()) {
            return { success: false, message: 'Verification code has expired.', status: 500 };
        }

        // Check if verification code is correct
        if (user.verificationCode !== verificationCode) {
            return { success: false, message: 'Verification code is incorrect.', status: 500 };
        }

        // Set user verification status to true and save
        user.verificationStatus = true;
        user.verificationCode = "";
        user.verificationCodeExpiresAt = "";
        await user.save();

        return { success: true, message: 'User verified successfully.', status: 200 };
    } catch (err) {
        throw new Error({
            error: errorCode.SERVER_ERROR.code,
            message: errorCode.SERVER_ERROR.message,
            status: 500
        });
    }
};

async function sendVerificationCodeAgain(email) {
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error({
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if user has not verified yet
        if (!user.verificationStatus) {
            // Check if verification code has expired
            const now = new Date();
            if (now > user.verificationCodeExpiresAt) {
                // Generate new code and set new expiry time
                const verificationCode = generateVerificationCode();
                const codeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

                // Update user document
                user.verificationCode = verificationCode;
                user.verificationCodeExpiresAt = codeExpiry;
                await user.save();
            }

            const data = {
                username: user.username,
                verificationCode: user.verificationCode,
                verificationLink: 'https://example.com/verify',
                subject: 'Verification code - QuickCart'
            };

            // Send email
            await sendEmail(user.email, data, './verification/verificationCode.hbs');
            return { message: 'Verification code sent successfully.', status: 200, success: true };
        } else {
            return { success: false, message: 'User is already verified.', status: 500 };
        }
    } catch (err) {
        throw new Error({
            error: errorCode.SERVER_ERROR.code,
            message: errorCode.SERVER_ERROR.message,
            status: 500
        });
    }
}

module.exports = { sendVerificationCode, verifyUser, sendVerificationCodeAgain };
