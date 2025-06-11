const jwt = require('jsonwebtoken')
require('dotenv').config()
const {findUserByToken} = require('../repo/user')

// const verifyJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization || req.headers.Authorization
//     if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
//     console.log(authHeader)
//     const token = authHeader.split(' ')[1]
//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,
//         (err, decoded) => {
//             if(err) return res.sendStatus(403)
//             req.user = decoded.UserInfo.username
//             req.roles = decoded.UserInfo.roles
//             next()
//         }
//     )
// }
const verifyJWT = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const token = cookies.jwt;
    const dbUser = findUserByToken(token)
    if(dbUser === null) {
        return res.sendStatus(401);
    }

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403)
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.role
            next()
        }
    )
}

module.exports = verifyJWT