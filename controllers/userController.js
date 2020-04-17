const { User } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const getFullName = require('../helpers/getFullName')
const jwt = require('jsonwebtoken')

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

    static login(req, res, next) {
        let userPayload
        const {
            email,
            password
        } = req.body
        User.findOne({
            email
        })
        .then(userData => {
            if(!userData) {
                throw ({
                    statusCode: 404,
                    message: 'Wrong username / password'
                })
            } else {
                userPayload = {
                    _id: userData._id,
                    fullName: getFullName(userData.firstName, userData.lastName),
                    email: userData.email,
                    division: userData.division,
                    level: userData.level
                }
                return comparePassword(password, userData.password)
            }
        })
        .then(compareResult => {
            if(!compareResult) {
                throw ({
                    statusCode: 404,
                    message: 'Wrong username / password'
                })
            } else {
                const token = jwt.sign({
                    _id: userPayload._id
                }, process.env.JWT_SECRET)
                res.status(200).json({
                    token,
                    ...userPayload
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = UserController