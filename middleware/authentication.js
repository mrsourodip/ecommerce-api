const CustomError = require('../errors');
const { removeListener } = require('../models/user');
const { isTokenValid } = require('../utils');

// to check if an user is authenticated, we check req.signedCookies.token which is set in jwt.js
// this is used as middleware in all routes
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    try {
      const {name, userId, role} = isTokenValid({ token });
      req.user = {name, userId, role}
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
  };

// to check if certain permission are allowed in roles which are sent as params - admin, user to restrict certain functionalities
const authorizerPermissions = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) 
      throw new CustomError.UnauthorizedError('Unauthorized to access this resource')
    next()
  }
}
module.exports = {authenticateUser, authorizerPermissions}