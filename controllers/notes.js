const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

const decodeToken = (request) => {
  const authorization = request.get('authorization')

  const parsedToken =
    authorization && authorization.startsWith('Bearer ')
      ? authorization.replace('Bearer ', '')
      : null

  return jwt.verify(parsedToken, process.env.TOKEN_SECRET)
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const foundNote = await Note.findById(request.params.id)

  if (foundNote) {
    response.json(foundNote)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = decodeToken(request)
  if (!decodeToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true
  })
  response.json(updatedNote)
})

module.exports = notesRouter
