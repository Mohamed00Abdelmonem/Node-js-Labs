const userController = require('../controllers/userController')
const router = require('express').Router()
const validator = require('../middlewares/validator')
const { createUserSchema, updateUserSchema, loginSchema } = require('../validators/userSchemas')
const { restrictTo } = require('../middlewares/restrictTo')
const { validateToken } = require('../middlewares/validateToken')






router.get('/', validateToken, restrictTo('admin'), userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/signup', validator(createUserSchema), userController.signUp)
router.post('/login', validator(loginSchema), userController.login)
router.patch('/:id', validator(updateUserSchema), userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router