const morgan = require("morgan")
const logger = require("./logger")

// using morgan middleware 
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const notFoundEndpoint = (request, response, next) => {
  response.status(404).send({error: 'the endpoint is not registered!'})
}


const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (errorName === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (errorName === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  morganMiddleware,
  notFoundEndpoint,
  errorHandler
}

