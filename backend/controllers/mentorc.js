const Mentor = require('../models/mentorM')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const google = require('../utils/googleAuthentication')

// This function sends the user data of the user logged in
exports.dashboard = async (req, res) => {
  const userId = req.header('userId')
  if (!userId) return res.status(500).json({ error: 'userId not provided' })
  try {
    const mentor = await Mentor.findbyId(userId)
    // Only the information shown in the dashboard is too be passed
    return res.status(200).json(mentor)
  } catch (err) {
    return res.status(500).json({ error: 'User not found' })
  }
}

// This function deletes mentee account
exports.deleteacc = async (req, res) => {
  try {
    const mentee = await Mentor.deleteOne({ _id: req.body('mentorID') })
    if (mentee) return res.status(200).json('Mentor deleted')
    return res.status(400).json({ error: 'Mentor not found' })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}

exports.googlelogin = async (req, res) => {
  // get code from redirect url
  const code = req.query.code
  if (code) {
    const me = google.googleauth(code)

    if (!me) { return res.status(400).json({ error: 'User not found' }) }

    const userName = me.data.names[0].displayName
    const userEmail = me.data.emailAddresses[0].value

    const emailExist = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    // Create a user in database if user does not exist already
    if (!emailExist) {
      // Create a new user
      const user = new Mentor({
        name: userName,
        email: userEmail.toLowerCase(),
        password: 'googleauthenticated'
      })
      try {
        await user.save()
      } catch (err) {
        return res.status(400).json({ error: err })
      }
    }

    // Now get that user's id
    const mentee = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentee)
    return res.json({
      userId: mentee._id,
      'auth-token': token
    })
  }
}

exports.googleandroidlogin = async (req, res) => {
  // get code from redirect url
  const code = req.query.code
  if (code) {
    const me = google.googleandroidauth(code)

    if (!me) { return res.status(400).json({ error: 'User not found' }) }

    const userName = me.data.names[0].displayName
    const userEmail = me.data.emailAddresses[0].value

    const emailExist = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    // Create a user in database if user does not exist already
    if (!emailExist) {
      // Create a new user
      const mentor = new Mentor({
        name: userName,
        email: userEmail.toLowerCase(),
        password: 'googleauthenticated'
      })
      try {
        await mentor.save()
      } catch (err) {
        return res.status(400).json({ error: err })
      }
    }

    // Now get that user's id
    const mentor = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentor)
    return res.json({
      userId: mentor._id,
      'auth-token': token
    })
  }
}

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
  const emailExist = await Mentor.findOne({
    email: req.body.email.toLowerCase()
  })

  if (emailExist) {
    return res.status(400).json({
      error: 'Email already exists'
    })
  }

  const nameExist = await Mentor.findOne({
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
  const user = new Mentor({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    skills: [],
    mentors: []
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
  const user = await Mentor.findOne({
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
