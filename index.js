const express = require('express')
const app = express()
const morgan = require("morgan")

// to catch chunks of data
app.use(express.json()) // this is a middleware

//* HARD CODED DATA

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateRandomId = (max) => {
  return Math.floor(Math.random() * max) 
}

//* Middlewares

const notFoundEndpoint = (request, response, next) => {
  response.status(404).send({error: 'the endpoint is not registered!'})
}

// using morgan middleware 
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//* API DECLARATION

app.get('/api/persons/', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  !person 
    ? response.status(404).end()
    : response.json(person)
})

app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // checks 
  if (!body.number || !body.name) {
    response.status(404).json({"error":"Name or number is missing!"})
    return
  } 

  const nameExist = persons.some(person => person.name === body.name)
  if (nameExist) {
    response.status(404).json({"error":"The name must be unique!"})
    return
  }

  let newId = generateRandomId(10000000)
  
  const idExist = persons.some(person => person.id === newId)

  while(idExist) {
    console.log('generating new id')
    newId = generateRandomId(10000000)
  }
  
  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.get('/api/info/', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

app.get('/', (request, response) => {
  response.send({"info": "Welcome to the phonebook API"})

})

app.use(notFoundEndpoint)


//----------------
const PORT = 3001

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`)
})