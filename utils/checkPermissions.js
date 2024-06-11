const CustomError = require('../errors')

/**
 * This function checks Permissions for user:
 * 1. Checks if it is not admin
 * 2. If the requestUser object contains the same userId as the resourceUserId
 * This is done to ensure certain functionalities that are only applicable to one user, should not be accessible to others.
 * This is passed as middleware.
 * @param {*} requestUser 
 * @param {*} resourceUserId 
 */
const checkPermissons = (requestUser, resourceUserId) => {
    // console.log(requestUser); 
    // console.log(typeof requestUser); 
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    if(requestUser.role!=='admin' && requestUser.userId !== resourceUserId.toString())
        throw new CustomError.UnauthorizedError('User is not authorized to access this resource')
}

module.exports = checkPermissons