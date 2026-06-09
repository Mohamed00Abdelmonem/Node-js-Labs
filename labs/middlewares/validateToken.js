const jwt = require('jsonwebtoken')
const userServices = require('../services/userServices')
const APIError = require('../utils/APIError')
exports.validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new APIError(401, 'No token provided'))
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userServices.getUserById(decoded.id)
        if (!user) {
            throw new APIError(401, 'Invalid token')
        }
        req.user = user
        next()
    } catch (err) {
        return next(new APIError(401, 'Invalid token'))
    }
}   
