const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
// Set up env variables
dotenv.config()

const connectDB = require('./config/db')

const app = express()

// Connect to database
connectDB()

// Middleware functions
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/mentor', require('./routes/mentor'))
app.use('/api/mentee', require('./routes/mentee'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
