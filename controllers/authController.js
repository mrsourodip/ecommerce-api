const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils/index')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) throw new BadRequestError('Email Already Exists!')

    // first user registered will be admin
    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount ? "admin" : "user"

    const user = await User.create({ email, name, password, role })
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new BadRequestError('Please provide email and password')
    const user = await User.findOne({ email })
    if (!user) throw new UnauthenticatedError('Invalid Credentials')
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ msg: 'User Logged out!' })
}

module.exports = {
    register, login, logout
};