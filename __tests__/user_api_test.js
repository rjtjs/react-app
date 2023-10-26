const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const testUsers = [
  {
    username: 'testuser1',
    name: 'testname1',
    password: 'testpass1'
  },
  {
    username: 'testuser2',
    name: 'testname2',
    password: 'testpass2'
  }
]

beforeEach(async () => {
  await User.deleteMany({})

  const testUserObjs = testUsers.map((u) => new User(u))
  const promises = testUserObjs.map((u) => u.save())
  await Promise.all(promises)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

describe('test POST', () => {
  test('valid new user is added upon POST', async () => {
    const newUser = {
      username: 'testuser3',
      name: 'testname3',
      password: 'testpass3'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toEqual('testuser3')
  })

  test('')
})
