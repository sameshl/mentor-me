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

// Define Routes
app.use('/user', require('./routes/user'))
app.use('/user/login/google', require('./routes/googleAuth'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
