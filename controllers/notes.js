const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  try {
    const notes = await Note.find({})
    response.json(notes)
  } catch (ex) {
    next(ex)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const foundNote = await Note.findById(request.params.id)

    if (foundNote) {
      response.json(foundNote)
    } else {
      response.status(404).end()
    }
  } catch (ex) {
    next(ex)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch (ex) {
    next(ex)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (ex) {
    next(ex)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true
    })
    response.json(updatedNote)
  } catch (ex) {
    next(ex)
  }
})

module.exports = notesRouter
