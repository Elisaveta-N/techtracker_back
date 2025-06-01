const { findUserByUsername, findUserById, createDbUser } = require('../repo/user')

const bcrypt = require('bcrypt')


const handleNewUserDB = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and password are required"})

    
    // check for duplicate usernames
    const duplicate = await findUserByUsername(user)
    if(duplicate) return res.sendStatus(409) //Conflict
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        //store the new user
        const newUser = {
            "username": user.toUpperCase(), 
            "roles": ['USER'],
            "password": hashedPwd
        }
        const dbRes = await createDbUser(newUser)
        if(dbRes.code === 201) {
            console.log(dbRes.data)
            // res.status(dbRes.code).json({"status": `New user: ${JSON.stringify(dbRes.data)} created`})
            res.status(dbRes.code).json(dbRes.data)
        } else {
            res.status(dbRes.code).json(dbRes.data)
        }
        

    } catch(err) {
        res.status(500).json({"message": err.message})
    }

}


module.exports = {handleNewUserDB}