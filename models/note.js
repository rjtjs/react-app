const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to db...')

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.log('caught error connecting to db ', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj._v
  }
})

module.exports = mongoose.model('Note', noteSchema)
