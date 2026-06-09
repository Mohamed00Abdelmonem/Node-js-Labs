const validateKashierHash = require('./validateKashierHash')
const { validateToken } = require('./validateToken')
const { restrictTo } = require('./restrictTo')
const validator = require('./validator')

module.exports = {
    validateKashierHash,
    validateToken,
    restrictTo,
    validator
}
