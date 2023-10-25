require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<div>hello world<div>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content == undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const updatedNote = {
    content: body.content,
    important: body.important !== undefined ? body.important : false
  }

  Note.updateOne(
    { _id: request.params.id },
    {
      $set: { content: updatedNote.content, important: updatedNote.important }
    }
  )

  response.json(updatedNote)
})

app.delete('/api/notes/:id', (request, response) => {
  Note.deleteOne({ _id: ObjectId(request.params.id) })

  console.log(`note ${id} deleted`)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
