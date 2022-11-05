const app = require('express').Router()
const helloRoute = require('./routes/hello')

module.exports = () => {
  app.use('/hello', helloRoute)
  return app
}
