const Joi = require('joi')

const createDonationSchema = Joi.object({
    amount: Joi.number().min(10).required()
}).unknown(false)

module.exports = {
    body: createDonationSchema
}
