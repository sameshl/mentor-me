const { match } = require('../utils/match')
const Mentee = require('../models/menteeM')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const google = require('../utils/googleAuthentication')

// This function sends the user data of the user logged in
exports.dashboard = async (req, res) => {
  const userId = req.header('menteeId')
  if (!userId) return res.status(200).json({ success: false, msg: 'userId not provided' })
  try {
    const mentee = await Mentee.findbyId(userId)
    res.status(200).json({ success: false }, mentee)
  } catch (err) {
    res.status(200).json({ success: false, msg: 'User not found' })
  }
}

// This function matches a mentor and then saves it in the database
exports.query = async (req, res) => {
  // Front end should pass appropriate data so as to find mentee whose mentor has to be found(Session)
  try {
    // Get mentorId from match function
    const mentorID = match(req.body('skills'))
    if (mentorID) {
      res.status(200).json({ success: true }, mentorID) // Send back the mentorId to send notification to the mentor
    } else {
      res.status(200).json({ success: false, msg: 'Mentor not found' })
    }
  } catch (err) {
    res.status(200).json({ success: false, msg: 'Server error' })
  }
}

// This function deletes mentee account
exports.deleteacc = async (req, res) => {
  try {
    const mentee = await Mentee.deleteOne({ _id: req.body('menteeID') })
    if (mentee) return res.status(200).json({ success: true, msg: 'Mentee deleted' })
    return res.status(200).json({ success: false, msg: 'Mentee not found' })
  } catch (err) {
    return res.status(200).json({ success: false, msg: 'Server error' })
  }
}

exports.googlelogin = async (req, res) => {
  // get code from redirect url
  const code = req.query.code
  if (code) {
    const me = google.googleauth(code)

    if (!me) { return res.status(200).json({ success: false, msg: 'User not found' }) }

    const userName = me.data.names[0].displayName
    const userEmail = me.data.emailAddresses[0].value

    const emailExist = await Mentee.findOne({
      email: userEmail.toLowerCase()
    })

    // Create a user in database if user does not exist already
    if (!emailExist) {
      // Create a new user
      const user = new Mentee({
        name: userName,
        email: userEmail.toLowerCase(),
        password: 'googleauthenticated'
      })
      try {
        await user.save()
      } catch (err) {
        res.status(200).json({ success: false, msg: 'Server error. User not saved.' })
      }
    }

    // Now get that user's id
    const mentee = await Mentee.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentee)
    return res.status(200).json({
      success: true,
      userId: mentee._id,
      authToken: token
    })
  }
}

exports.googleandroidlogin = async (req, res) => {
  // get code from redirect url
  const code = req.query.code
  if (code) {
    const me = google.googleandroidauth(code)

    if (!me) { return res.status(200).json({ success: false, msg: 'User not found' }) }

    const userName = me.data.names[0].displayName
    const userEmail = me.data.emailAddresses[0].value

    const emailExist = await Mentee.findOne({
      email: userEmail.toLowerCase()
    })

    // Create a user in database if user does not exist already
    if (!emailExist) {
      // Create a new user
      const mentee = new Mentee({
        name: userName,
        email: userEmail.toLowerCase(),
        password: 'googleauthenticated'
      })
      try {
        await mentee.save()
      } catch (err) {
        res.status(200).json({ success: false, msg: 'Server error. User not saved.' })
      }
    }

    // Now get that user's id
    const mentee = await Mentee.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentee)
    return res.status(200).json({
      success: true,
      userId: mentee._id,
      authToken: token
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
    return res.status(200).json({
      success: false,
      msg: error.details[0].message
    })
  }
  // Check if user already exists
  const emailExist = await Mentee.findOne({
    email: req.body.email.toLowerCase()
  })

  if (emailExist) {
    return res.status(200).json({
      success: false,
      msg: 'Email already exists'
    })
  }

  const nameExist = await Mentee.findOne({
    name: req.body.name
  })

  if (nameExist) {
    return res.status(200).json({
      success: false,
      msg: 'Username already exists'
    })
  }

  // Hash passwords
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Create a new user
  const user = new Mentee({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    skills: [],
    mentors: []
  })

  try {
    await user.save()
    // Create and assign a token
    const TOKEN_SECRET = process.env.TOKEN_SECRET
    const token = jwt.sign({
      _id: user._id
    }, TOKEN_SECRET)
    return res.status(200).json({
      success: true,
      userId: user._id,
      authToken: token
    })
  } catch (err) {
    return res.status(200).json({
      success: false,
      msg: 'Registration unsuccesful.'
    })
  }
}

exports.login = async (req, res) => {
  // Validate the login data
  const {
    error
  } = loginValidation(req.body)

  if (error) {
    return res.status(200).json({
      success: false,
      msg: error.details[0].message
    })
  }

  // Check if email exists
  const user = await Mentee.findOne({
    email: req.body.email.toLowerCase()
  })

  if (!user) {
    return res.status(200).json({
      success: false,
      msg: 'Email or the password is wrong'
    })
  }

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    return res.status(200).json({
      success: false,
      msg: 'Email or the password is wrong'
    })
  }

  // Create and assign a token
  const TOKEN_SECRET = process.env.TOKEN_SECRET
  const token = jwt.sign({
    _id: user._id
  }, TOKEN_SECRET)
  res.json({
    success: true,
    userId: user._id,
    authToken: token
  })
}
