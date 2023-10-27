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

  const promises = testUserObjs.map((u) =>
    api
      .post('/api/users')
      .send(u)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  )

  await Promise.all(promises)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

describe('test POST', () => {
  test('existing user, correct pass, login succeeds', async () => {
    const loginData = {
      username: 'testuser1',
      password: 'testpass1'
    }

    const users = await api.get('/api/users')
    console.log('get ', users.body)

    const result = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toEqual('testuser1')
    expect(result.body.name).toEqual('testname1')
  })
})
