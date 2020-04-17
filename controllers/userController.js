const { User } = require('../models')

class UserController {
    static register (req, res, next) {
        const {
            firstName,
            lastName,
            email,
            division,
            password,
            level
        } = req.body
        User.create({
            firstName,
            lastName,
            email,
            division,
            password,
            level
        })
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = UserController