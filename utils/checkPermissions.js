const CustomError = require('../errors')

const checkPermissons = (requestUser, resourceUserId) => {
    console.log(requestUser); 
    console.log(typeof requestUser); 
    console.log(resourceUserId);
    console.log(typeof resourceUserId);
    if(requestUser.role!=='admin' && requestUser.userId !== resourceUserId.toString())
        throw new CustomError.UnauthorizedError('User is not authorized to access this resource')
}

module.exports = checkPermissons