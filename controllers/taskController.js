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
        .then(() => {
            return Task.find({
                owner: req.loggedUser._id
            })
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static findUserTasks (req, res, next) {
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
                owner: req.loggedUser._id
            })
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
        Task.updateMany({
            status: 'Active',
            createdAt: {
                $lt: startOfDay,
            }
        }, {status: 'Expired'})
        .then(() => {
            return Task.find({
                division: req.loggedUser.division
            }).populate('owner', ['firstName', 'lastName'])
        })
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
        .then(editedTask => {
            if (req.loggedUser.level === 'Manager' && editedTask.owner !== req.loggedUser._id) {
                return Task.find({
                    division: req.loggedUser.division
                }).populate('owner', ['firstName', 'lastName'])
            } else if (editedTask.owner === req.loggedUser._id){
                return Task.find({
                    owner: req.loggedUser._id
                })
            }
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static updateStatus (req, res, next) {
        Task.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        })
        .then(() => {
            if (req.body.status === 'Submitted') {
                return Task.find({
                    owner: req.loggedUser._id
                })
            } else {
                return Task.find({
                    division: req.loggedUser.division
                }).populate('owner', ['firstName', 'lastName'])
            }
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }

    static deleteTask (req, res, next) {
        Task.findByIdAndDelete(req.params.id)
        .then(deletedTask => {
            if (req.loggedUser.level === 'Manager' && deletedTask.owner !== req.loggedUser._id) {
                return Task.find({
                    division: req.loggedUser.division
                }).populate('owner', ['firstName', 'lastName'])
            } else if (`${deletedTask.owner}` === `${req.loggedUser._id}`){
                return Task.find({
                    owner: req.loggedUser._id
                })
            }
        })
        .then(userTasks => {
            res.status(200).json(userTasks)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = TaskController