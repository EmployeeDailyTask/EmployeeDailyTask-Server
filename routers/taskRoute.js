const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const { managerAuthorization, editAuthorization } = require('../middlewares/authorization')
const taskController = require('../controllers/taskController')

router
    .use(authentication)
    .post('/', taskController.createTask)
    .get('/', taskController.findUserTasks)
    .get('/manager', managerAuthorization, taskController.managerFindTasks)
    .get('/manager/:status', managerAuthorization, taskController.managerFindbyStatus)
    .get('/:status', taskController.findbyStatus)
    .put('/:id', editAuthorization, taskController.editTask)
    .patch('/:id', editAuthorization, taskController.updateStatus)
    .delete('/:id', editAuthorization, taskController.deleteTask)

module.exports = router