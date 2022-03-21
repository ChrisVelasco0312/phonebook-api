const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const config =  require('./utils/config')
const personsApi = require('./controller/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app =  express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
  })

  // register main middlewares // executing first
  app.use(middleware.morganMiddleware)
  app.use(cors())
  // serving static react files
  app.use(express.static('build'))
  // capture json data
  app.use(express.json())
  
  // register api person
  app.use('/api/persons', personsApi)
  
  // register middlewares // executing last
  app.use(middleware.notFoundEndpoint)
  app.use(middleware.errorHandler)

  module.exports = app