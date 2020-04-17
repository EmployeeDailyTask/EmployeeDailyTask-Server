const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const taskController = require('../controllers/taskController')

router
    .use(authentication)
    .post('/', taskController.createTask)

module.exports = router