const router = require('express').Router()
const userController = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const { HRAuthorization } = require('../middlewares/authorization')

router
    .post('/login', userController.login)
    .use(authentication)
    .use(HRAuthorization)
    .post('/register', userController.register)

module.exports = router