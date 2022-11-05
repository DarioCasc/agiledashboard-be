const route = require('express').Router()
const welcomeController = require('../controllers/welcome')

route.get('/greeting', welcomeController.greeting)

module.exports = route
