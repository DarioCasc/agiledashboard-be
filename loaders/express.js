const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const config = require('../config')
const routes = require('../api')

module.exports = (app) => {
  app.use(helmet())
  app.use(compression())
  app.use(bodyParser.json())

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token')
    next()
  })

  app.use('/public', express.static(path.join(path.dirname(require.main.filename), 'public')))

  app.use(config.env.api.prefix, routes())

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Resource not found!')
    next(err)
  })

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    res.json({
      message: err.data && err.data.length > 0 ? err.data[0].msg : err.message,
      data: err.data
    })
  })
}
