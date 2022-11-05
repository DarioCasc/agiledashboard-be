const app = require('express').Router()
const welcomeRoute = require('./routes/welcome')

module.exports = () => {
  app.use('/welcome', welcomeRoute)
  return app
}
