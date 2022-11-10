const app = require('express').Router()
const agileDashboardRoute = require('./routes/agileDashboard')

module.exports = () => {
  app.use('/agile-dashboard', agileDashboardRoute)
  return app
}
