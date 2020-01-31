const mongoose = require('mongoose')
const db = process.env.MONGO_URI
console.log(db)

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: false
    })
    console.log('MongoDB Atlas connected!')
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
