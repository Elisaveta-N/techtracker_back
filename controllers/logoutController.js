const { findUserByUsername, findUserById, createDbUser, findUserByToken, updateUser} = require('../repo/user')


const handleLogoutDb = async function (req, res) {
    //on client also delete access token

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //No content

    const refreshToken = cookies.jwt
    // res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true})
    res.cookie('jwt', '', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})

    //Is refresh token in DB?
    const foundUser = await findUserByToken(refreshToken)
    if(!foundUser){
        // res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true})

        return res.sendStatus(204)
    } 

    //Delete refresh token in DB
    const dbUser = await updateUser(foundUser.id, {refreshToken: ''})
    if(!dbUser) {
        console.error('Failed to update refreshToken in the database')
    }

    // res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true})
    return res.sendStatus(204)
}

module.exports = {handleLogoutDb}