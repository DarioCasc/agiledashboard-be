const express = require('express')
const loaders = require('./loaders')
const config = require('./config')

const startServer = () => {
  const app = express()

  loaders.init(app)

  app.listen(config.env.port, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(`app listening on port ${config.env.port}`)
  }).on('error', (err) => {
    console.error(err)
    process.exit(1)
  })
}

startServer()
