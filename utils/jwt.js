const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

// generate JWT with the help of jsonwebtoken which has sign method that accepts the payload, the secret ad the expiresIn condition
const createJWT = ({payload}) => {  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    return token
}

// checks if the token(jwt) is valid - used for password reset
const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET)

// sending the JWT in cookies instead of responseBody. To pass it, we have the following opitons: httpOnly - true, expires: oneDay after, secure only when node_env is set to production, signed is true so cookie will be found in res.signedCookie
const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload:user})
    const oneDay = 1000*60*60*24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now()+oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
    // attach it to res
    // res.status(StatusCodes.OK).json({user})
}

module.exports = { createJWT, isTokenValid, attachCookiesToResponse }