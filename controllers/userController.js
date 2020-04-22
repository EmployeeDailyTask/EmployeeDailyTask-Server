const { User } = require('../models')
const { comparePassword, hashPassword } = require('../helpers/bcrypt')
const getFullName = require('../helpers/getFullName')
const jwt = require('jsonwebtoken')

class UserController {
    static register (req, res, next) {
        const {
            firstName,
            lastName,
            email,
            division,
            level
        } = req.body
        User.create({
            firstName,
            lastName,
            email,
            division,
            password: `xcidic${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            level
        })
        .then(newUser => {
            newUser = {
                ...newUser._doc,
                password: 0
            }
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

    static getOneUser (req, res, next) {
        User.findOne({
            _id: req.loggedUser._id
        })
        .then(userData => {
            const userPayload = {
                _id: userData._id,
                fullName: getFullName(userData.firstName, userData.lastName),
                email: userData.email,
                division: userData.division,
                level: userData.level
            }
            res.status(200).json(userPayload)
        })
        .catch(err => {
            next(err)
        })
    }

    static getDivisionEmployee (req, res, next) {
        User.find({
            division: req.loggedUser.division,
            level: 'Employee'
        }, {
            password: 0
        })
        .then(divisionEmployees => {
            res.status(200).json(divisionEmployees)
        })
        .catch(err => {
            next(err)
        })
    }

    static getAllEmployee (req, res, next) {
        User.find({}, {
            password: 0
        })
        .then(divisionEmployees => {
            res.status(200).json(divisionEmployees)
        })
        .catch(err => {
            next(err)
        })
    }

    static changePassword (req, res, next) {
        let userInfo
        let { oldPassword, newPassword } = req.body
        User.findOne({
            _id: req.loggedUser._id
        })
        .then(userDetails => {
            userInfo = userDetails
            return comparePassword(oldPassword, userDetails.password)
        })
        .then(compareResult => {
            if(!compareResult) {
                throw ({
                    statusCode: 404,
                    message: 'Last Password did not match'
                })
            } else {
                return User.findByIdAndUpdate(req.loggedUser._id, {
                    password: newPassword
                })
            }
        })
        .then(updatedUserData => {
            updatedUserData = {
                ...updatedUserData,
                password: 0
            }
            res.status(200).json(updatedUserData)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = UserController