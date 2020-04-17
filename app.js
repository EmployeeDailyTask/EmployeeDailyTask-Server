if(process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const routers = require('./routers')
const mongoose = require('mongoose')
const mongodb = process.env.MONGO_ATLAS || 'mongodb://localhost:27017/employeeDailyTaskApp'
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

mongoose.connect(mongodb, {useNewUrlParser:true, useUnifiedTopology: true})
.then(() => {
    console.log(`connected to MongoDb on ${mongodb}`)
})

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use('/', routers)
    .use(errorHandler)

module.exports = app