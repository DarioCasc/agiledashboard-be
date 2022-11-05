/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const config = require('../config')

module.exports = async () => {
  const connection = await mongoose.connect(config.env.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
}
