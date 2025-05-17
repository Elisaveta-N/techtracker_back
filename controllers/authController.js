const { findUserByUsername, findUserById, createDbUser, updateUser } = require('../repo/user')

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
// require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async function (req, res) {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and password are required"})

    const foundUser = userDB.users.find(person => person.username === user)
    if(!foundUser) return res.sendStatus(401)

    //check password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles)
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
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"}
        )

        // store refresh token for current user into database
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken}
        userDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        )
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({accessToken})
    } else {
        res.sendStatus(401)
    }
}

const handleLoginDb = async function (req, res) {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and password are required"})

    const foundUser = await findUserByUsername(user)
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
            {"username": foundUser.username},
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

module.exports = {handleLogin, handleLoginDb}