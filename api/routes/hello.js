const route = require('express').Router()
const helloController = require('../controllers/hello')

route.get('', helloController.greeting)

module.exports = route
