const { Task } = require('../models')

class TaskController {
    static createTask (req, res, next) {
        const {
            title,
            description
        } = req.body
        Task.create({
            title,
            description,
            status: 'Active',
            owner: req.loggedUser._id
        })
        .then(newTask => {
            res.status(201).json(newTask)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = TaskController