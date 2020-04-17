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
            owner: req.loggedUser._id,
            division: req.loggedUser.division
        })
        .then(newTask => {
            res.status(201).json(newTask)
        })
        .catch(err => {
            next(err)
        })
    }

    static findUserTasks (req, res, next) {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        Task.find({
            owner: req.loggedUser._id,
            createdAt: {
                $gte: startOfDay
            }
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static findbyStatus (req, res, next) {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        Task.updateMany({
            status: 'Active',
            createdAt: {
                $lt: startOfDay,
            }
        }, {status: 'Expired'})
        .then(() => {
            return Task.find({
                owner: req.loggedUser._id,
                status: req.params.status
            })
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static managerFindTasks (req, res, next) {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        Task.find({
            division: req.loggedUser.division,
            createdAt: {
                $gte: startOfDay
            }
        }).populate('owner', ['firstName', 'lastName'])
        .then(employeeTasks => {
            res.status(200).json(employeeTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static managerFindbyStatus (req, res, next) {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        Task.updateMany({
            status: 'Active',
            createdAt: {
                $lt: startOfDay,
            }
        }, {status: 'Expired'})
        .then(() => {
            return Task.find({
                division: req.loggedUser.division,
                status: req.params.status
            }).populate('owner', ['firstName', 'lastName'])
        })
        .then(employeeTasks => {
            res.status(200).json(employeeTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static editTask (req, res, next) {
        const {
            title,
            description
        } = req.body
        Task.findByIdAndUpdate(req.params.id, {
            title,
            description
        })
        .then(updatedTask => {
            res.status(200).json(updatedTask)
        })
        .catch(err => {
            next(err)
        })
    }

    static updateStatus (req, res, next) {
        Task.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        })
        .then(updatedTask => {
            res.status(200).json(updatedTask)
        })
        .catch(err => {
            next(err)
        })
    }

    static deleteTask (req, res, next) {
        Task.findByIdAndDelete(req.params.id)
        .then(deletedTask => {
            res.status(200).json(deletedTask)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = TaskController