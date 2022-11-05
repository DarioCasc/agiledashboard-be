const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️')
}

exports.env = {
  port: parseInt(process.env.PORT, 10),
  api: {
    prefix: '/rest/api/deloitte'
  }
}
