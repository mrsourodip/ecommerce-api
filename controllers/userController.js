
const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser,
    attachCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user)
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })
}
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password')
    if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({ user })
}
const updateUser = async (req, res) => {
    const { name, email } = req.body
    if (!name || !email) throw new CustomError.BadRequestError('Please enter email and name')
    // const user = await User.findOne({ _id: req.user.userId })
    // if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.userId}`)
    const user = await User.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true })
    user.email = email;
    user.name = name;

    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });

}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    // handle validation
    if (!oldPassword || !newPassword) throw new CustomError.BadRequestError('Invalid input: Need both old and new password')
    // get user by userId
    console.log(req.user)
    const user = await User.findOne({ _id: req.user.userId })
    if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.userId}`)
    // check if oldPassword is correct
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid Credentials')
    // set new password
    user.password = newPassword
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
}



module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }