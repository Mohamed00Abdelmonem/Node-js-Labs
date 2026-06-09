const Router = require('express').Router()
const postController = require('../controllers/postController')
const { validateToken } = require('../middlewares/validateToken')
const validator = require('../middlewares/validator')
const { createPostSchema, updatePostSchema } = require('../validators/postSchemas')

Router.get('/',validateToken ,postController.getAllPosts)
Router.get('/:id', validateToken, postController.getPostById)
Router.post('/',validateToken, validator(createPostSchema), postController.createPost)
Router.patch('/:id',validateToken, validator(updatePostSchema), postController.updatePost)
Router.delete('/:id', validateToken, postController.deletePost)

module.exports = Router