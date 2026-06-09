const APIError = require('../utils/APIError')
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new APIError(403, 'You are not allowed to perform this action'))
        }
        next()
    }
}