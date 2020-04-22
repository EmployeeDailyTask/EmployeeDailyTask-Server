const { Task } = require('../models')
const unauthorized = {
    statusCode: 401,
    message: 'Unauthorized Access'
}

function managerAuthorization (req, res, next) {
    if(req.loggedUser.level !== 'Manager') {
        next(unauthorized)
    } else {
        next()
    }
}

function HRAuthorization (req, res, next) {
    if(req.loggedUser.division !== 'Human Resources') {
        next(unauthorized)
    } else {
        next()
    }
}

function editAuthorization (req, res, next) {
    Task.findOne({
        _id: req.params.id
    })
    .then(taskData => {
        if(!taskData) {
            next({
                statusCode: 404,
                message: 'Task Not Found'
            })
        } else {
            if(req.body.status == 'Finished' && req.loggedUser.level !== 'Manager' && req.loggedUser.division !== taskData.division){
                next(unauthorized)
            } else if(taskData.owner !== req.loggedUser._id) {
                if(req.loggedUser.level !== 'Manager' && req.loggedUser.division !== taskData.division) {
                    next(unauthorized)
                } else {
                    next()
                }
            } else {
                next()
            }
        }
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {
    managerAuthorization,
    HRAuthorization,
    editAuthorization
}