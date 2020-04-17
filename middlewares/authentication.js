const jwt = require('jsonwebtoken')
const { User } = require('../models')

module.exports = function (req, res, next) {
    try {
        req.loggedUser = jwt.verify(req.headers.token, process.env.JWT_SECRET)

        const userFound = User.findOne({
            _id: req.loggedUser._id
        })
            .then(userFound => {
                if (!userFound) {
                    next ({
                        statusCode: 400,
                        message: 'Invalid token'
                    })
                } else {
                    req.loggedUser.level = userFound.level
                    req.loggedUser.division = userFound.division
                    next()
                }
            })
            .catch(err => {
                next ({
                    statusCode: 400,
                    message: 'Invalid token'
                })
            })

    } catch (err) {
        next({
            statusCode: 400,
            message: 'Invalid token'
        })
    }
}