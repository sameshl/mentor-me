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

require('../backend/routes/mentor.js')()
require('../backend/routes/mentee.js')()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
