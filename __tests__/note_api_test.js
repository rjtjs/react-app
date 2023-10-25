const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

const testNotes = [
  {
    content: 'test note 1',
    important: false
  },
  {
    content: 'test note 2',
    important: true
  }
]

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObj = new Note(testNotes[0])
  await noteObj.save()

  noteObj = new Note(testNotes[1])
  await noteObj.save()
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(testNotes.length)
})

test('specific notes are in returned notes', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map((r) => r.content)

  expect(contents).toContain('test note 1')
  expect(contents).toContain('test note 2')
})

test('note with content is added to db', async () => {
  const newNote = {
    content: 'test note 3'
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(testNotes.length + 1)

  const contents = response.body.map((r) => r.content)
  expect(contents).toContain('test note 3')
})

test('note without content is rejected', async () => {
  const newNote = {
    important: true
  }

  await api.post('/api/notes').send(newNote).expect(400)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(testNotes.length)
})

test('a specific note can be viewed', async () => {
  const response = await api.get('/api/notes')
  const noteToCheck = response.body[0]

  const noteResponse = await api
    .get(`/api/notes/${noteToCheck.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(noteResponse.body).toEqual(noteToCheck)
})

test('a note can be deleted', async () => {
  const response = await api.get('/api/notes')
  const initialNotes = response.body
  const noteToDelete = response.body[0]

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const remainingNotes = await api.get('/api/notes')
  expect(remainingNotes.body).toHaveLength(initialNotes.length - 1)

  const remainingContent = remainingNotes.body.map((n) => n.content)
  expect(remainingContent).not.toContain(noteToDelete.content)
})

afterAll(async () => {
  await Note.deleteMany({})
  await mongoose.connection.close()
})
