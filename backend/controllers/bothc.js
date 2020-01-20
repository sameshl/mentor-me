const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const {
  registerValidation,
  loginValidation
} = require('../utils/validation')

exports.register = async (req, res) => {
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
}

exports.login = async (req, res) => {
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
}
