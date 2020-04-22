const router = require('express').Router()
const userRoute = require('./userRoute')
const taskRoute = require('./taskRoute')

router
    .use('/tasks', taskRoute)
    .use('/', userRoute)

module.exports = router