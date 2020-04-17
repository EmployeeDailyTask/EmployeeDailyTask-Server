const bcrypt = require('bcrypt')
const saltRounds = 10

function hashPassword(password) {
    return new Promise((res, rej) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, function(err, hashedPassword) {
                if (err) {
                    rej(err)
                } else {
                    res(hashedPassword)
                }
            })
        })
    })
}

function comparePassword(password, hashedPassword) {
    return new Promise ((res, rej) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if(err){
                rej(err)
            }else{
                res(result)
            }
        })
    })
}


module.exports = {
    hashPassword,
    comparePassword
}