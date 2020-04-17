const mongoose = require('mongoose')
const { Schema } = mongoose
const { hashPassword } = require('../helpers/bcrypt')

const division = {
    values: ['IT', 'Design', 'Human Resources'],
    message: 'Division not found.'
}

const level = {
    values: ['Employee', 'Manager'],
    message: 'Level not valid'
}

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please fill in all fields.']
    },
    lastName: {
        type: String,
        required: [true, 'Please fill in all fields.']
    },
    email: {
        type: String,
        required: [true, 'Please fill in all fields.'],
        validate:[
            {
                validator: email => {
                    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
                    return emailRegex.test(email)
                },
                message: 'Please use the correct email format'
            },
            {
                validator: email => {
                    return new Promise((res, rej) => {
                        user.findOne({
                            email
                        })
                        .then(userFound => {
                            if (userFound) {
                                res(false)
                            } else {
                                res(true)
                            }
                        })
                        .catch(err => {
                            rej(false)
                        })
                    })
                },
                message: 'Please make sure email has never been registered before.'
            }
        ]
    },
    division: {
        type: String,
        required: [true, 'Please fill in all fields.'],
        enum: division
    },
    password: {
        type: String,
        required: [true, 'Please fill in all fields.'],
        validate: [
            {
                validator: password => {
                    return password.length >= 6
                },
                message: 'Passwords must contain at least 6 characters.'
            }
        ]
    },
    level: {
        type: String,
        required: [true, 'Please fill in all fields.'],
        enum: level
    }
})

userSchema.pre('save', function(next) {
    return hashPassword(this.password)
    .then(hashedPassword => {
        this.password = hashedPassword
        next()
    })
    .catch(err => {
        next(err)
    })
})

const user = mongoose.model('User', userSchema)

module.exports = user