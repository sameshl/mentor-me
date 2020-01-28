const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

// Set up env variables
dotenv.config()

const connectDB = require('./config/db')

const app = express()

// Connect to database
connectDB()

// Middleware functions
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/mentor', require('./routes/mentee'))
app.use('/api/mentee', require('./routes/mentee'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
