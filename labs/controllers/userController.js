const userServices = require('../services/userServices')
const APIError = require('../utils/APIError')
const emailService = require('../services/emailService')

exports.getAllUsers = async (req, res) => {
    const users = await userServices.getAllUsers()
    res.status(200).json(users)
}

exports.getUserById = async (req, res,next) => {
    const user = await userServices.getUserById(req.params.id)
    if (user) {
        res.status(200).json(user)
    } else {
        next(new APIError(404, 'User not found'))
    }
}

exports.signUp = async (req, res,next) => {
    const signupResult = await userServices.signUp(req.body)
    if (!signupResult) {
         return next(new APIError(400, 'Failed to create user'))
    }
    
    // Send welcome email after user has been successfully created in MongoDB
    await emailService.sendEmail(
        'welcome',
        { name: signupResult.name },
        signupResult.email,
        'Welcome to our platform'
    )
    
    res.status(201).json(signupResult)
}

exports.login = async (req, res,next) => {
    const { email, password } = req.body
    const { user, token } = await userServices.login(email, password)
    res.status(200).json({ user, token })
}

exports.updateUser = async (req, res,next) => {
    const updatedUser = await userServices.updateUser(req.params.id, req.body)
    if (updatedUser) {
        res.status(200).json(updatedUser)
    } else {
        next(new APIError(404, 'User not found'))
    }
}

exports.deleteUser = async (req, res,next) => {
    const success = await userServices.deleteUser(req.params.id)
    if (success) {
        res.status(204).send()
    } else {
        next(new APIError(404, 'User not found'))
    }
}

