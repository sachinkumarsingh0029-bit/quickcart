const errorCode = {
    CustomValidationError: {
        code: 'CustomValidationError',
        status: 400
    },
    MISSING_FIELDS: {
        code: 'missing_fields',
        message: 'Some required fields are missing',
        status: 400
    },
    USER_NOT_FOUND: {
        code: 'user_not_found',
        message: 'User not found',
        status: 404
    },
    AUTHENTICATION_FAILED: {
        code: 'authentication_failed',
        message: 'Authentication failed',
        status: 401
    },
    UNAUTHORIZED_ACCESS: {
        code: 'unauthorized_access',
        message: 'Unauthorized access',
        status: 403
    },
    SERVER_ERROR: {
        code: 'server_error',
        message: 'Internal server error',
        status: 500
    },
    ALREADY_EXISTS: {
        code: 'already_exists',
        message: 'Already Exists',
        status: 410
    },
};

module.exports = errorCode;