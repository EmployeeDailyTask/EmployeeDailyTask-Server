const router = require('express').Router()
const userController = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const { HRAuthorization, managerAuthorization } = require('../middlewares/authorization')

router
    .post('/login', userController.login)
    .use(authentication)
    .patch('/user', userController.changePassword)
    .get('/user', userController.getOneUser)
    .get('/manager/employee', managerAuthorization, userController.getDivisionEmployee)
    .use(HRAuthorization)
    .get('/hr/employee', userController.getAllEmployee)
    .post('/register', userController.register)

module.exports = router