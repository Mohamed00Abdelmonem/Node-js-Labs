const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const APIError = require('../utils/APIError')
const User = require('../models/User')

const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    return token
}

const validatePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword)
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS * 1)
}

const signUp = async (userData) => {
    let user = await User.findOne({ email: userData.email })
    if (user) {
        throw new APIError(400, 'Email already exists')
    }

    userData.password = await hashPassword(userData.password)

    user = await User.create(userData)
    return user
}

const login = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user || !(await validatePassword(password, user.password))) {
        throw new APIError(401, 'Invalid email or password')
    }

    const token = signToken(user._id)
    return { user, token }
}

const getAllUsers = async () => {
    return await User.find()
}

const getUserById = async (id) => {
    const user = await User.findOne({ _id: id })
    return user
}


const updateUser = async (id, userData) => {
    const user = await User.findOneAndUpdate({ _id: id }, userData, { new: true })
    return user
}

const deleteUser = async (id) => {
    await User.findOneAndDelete({ _id: id })
    return true
}


module.exports = {
    getAllUsers,
    getUserById,
    signUp,
    login,
    updateUser,
    deleteUser,
    signToken
}