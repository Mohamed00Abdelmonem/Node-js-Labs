const Joi = require('joi')

const createPostSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
}).unknown(false)

const updatePostSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string()
}).unknown(false)

module.exports = {
    createPostSchema,
    updatePostSchema
}