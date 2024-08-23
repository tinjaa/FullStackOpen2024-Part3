const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'))

const cors = require('cors')
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get('/info', (request, response) => {
    const date = new Date();
    response.end(`Phonebook has info for ${persons.length} people\n${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is required'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is required'
        })
    }

    const existingPerson = persons.find(person => person.name.trim().toLowerCase() === body.name.trim().toLowerCase())

    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
