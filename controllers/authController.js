const { findUserByUsername, findUserById, createDbUser, updateUser } = require('../repo/user')


const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


const handleLoginDb = async function (req, res) {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and password are required"})

    const foundUser = await findUserByUsername(user.toUpperCase())
    if(!foundUser) return res.sendStatus(401)

    //check password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "300s"}
        )

        const refreshToken = jwt.sign(
            {
                "UserInfo": {
                "username": foundUser.username,
                "role": Object.values(foundUser.roles)[0],
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"}
        )

        // store refresh token for current user into database
        const dbUser = await updateUser(foundUser.id, {refreshToken})
        if(!dbUser) {
            console.error('Failed to update refreshToken in the database')
        }

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({ roles, accessToken})
    } else {
        res.sendStatus(401)
    }
}

module.exports = {handleLoginDb}