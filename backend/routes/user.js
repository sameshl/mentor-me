// Handle authentication of users

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verify = require('../utils/verifyToken')

const {
  registerValidation,
  loginValidation
} = require('../utils/validation')

// Checks whitespaces in username (even white spaces like tab)
function hasWhiteSpace (s) {
  return /\s/g.test(s)
}

// @route   POST /user/register
// @desc    Register user
router.post('/register', async (req, res) => {
  // Validate the register data
  const {
    error
  } = registerValidation(req.body)

  if (error) {
    return res.status(500).json({
      error: error.details[0].message
    })
  }
  // Check if user already exists
  const emailExist = await User.findOne({
    email: req.body.email.toLowerCase()
  })

  if (emailExist) {
    return res.status(400).json({
      error: 'Email already exists'
    })
  }

  const nameExist = await User.findOne({
    name: req.body.name
  })

  if (nameExist) {
    return res.status(400).json({
      error: 'Username already exists'
    })
  }

  if (hasWhiteSpace(req.body.name)) {
    return res.status(400).json({
      error: 'Username cannot contain a whitespace'
    })
  }

  // Hash passwords
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hashedPassword
  })

  try {
    await user.save()

    return res.status(200).json({
      msg: 'Registration successful!'
    })
  } catch (err) {
    return res.status(400).json({
      error: err
    })
  }
})

// @route   POST /user/login
// @desc    Login user
router.post('/login', async (req, res) => {
  // Validate the login data
  const {
    error
  } = loginValidation(req.body)

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    })
  }

  // Check if email exists
  const user = await User.findOne({
    email: req.body.email.toLowerCase()
  })

  if (!user) {
    return res.status(400).json({
      error: 'Email or the password is wrong'
    })
  }

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    return res.status(400).json({
      error: 'Email or the password is wrong'
    })
  }

  // Create and assign a token
  const TOKEN_SECRET = process.env.TOKEN_SECRET
  const token = jwt.sign({
    _id: user._id
  }, TOKEN_SECRET)
  res.json({
    userId: user._id,
    'auth-token': token
  })
})

// @route   GET /user/dashboard
// @desc    Dashboard for the logged in  user ( private route )
// expects 'auth-token' and 'userId' in header of request
router.get('/dashboard', verify, async (req, res) => {
  const userId = req.header('userId')
  if (!userId) return res.status(500).json({ error: 'userId not provided' })
  try {
    const user = await User.findById(userId)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'User not found' })
  }
})

module.exports = router
