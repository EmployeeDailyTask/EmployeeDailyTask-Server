const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const { managerAuthorization } = require('../middlewares/authorization')
const taskController = require('../controllers/taskController')

router
    .use(authentication)
    .post('/', taskController.createTask)
    .get('/', taskController.findUserTasks)
    .get('/:status', taskController.findbyStatus)
    .use(managerAuthorization)
    .get('/manager', taskController.managerFindTasks)
    .get('/manager/:status')

module.exports = router