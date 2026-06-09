const queryString = require('query-string')
const _ = require('underscore')
const crypto = require('crypto')
const APIError = require('../utils/APIError')

/**
 * Express middleware to validate Kashier webhook payload signature.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
    const { data, event } = req.body
    if (!data || !data.signatureKeys) {
        throw new APIError("Invalid signature", 401)
    }

    // 1. Sort data.signatureKeys alphabetically
    const sortedKeys = [...data.signatureKeys].sort()

    // 2. Pick only the fields named in signatureKeys from data
    const pickedData = _.pick(data, sortedKeys)

    // 3. Convert that object to a URL-encoded query string with query-string's stringify
    const payload = queryString.stringify(pickedData)

    // 4. Compute HMAC-SHA256(payload, KASHIER_API_KEY) and hex-digest it
    const computedSignature = crypto
        .createHmac('sha256', process.env.KASHIER_API_KEY)
        .update(payload)
        .digest('hex')

    // 5. Compare against the value of the x-kashier-signature request header
    const kashierSignature = req.headers['x-kashier-signature']

    if (computedSignature !== kashierSignature) {
        throw new APIError("Invalid signature", 401)
    }

    next()
}
