const Mentor = require('../models/mentorM')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const google = require('../utils/googleAuthentication')

// This function sends the user data of the user logged in
exports.dashboard = async (req, res) => {
  const userId = req.header('mentorId')
  if (!userId) return res.status(200).json({ success: false, msg: 'userId not provided' })
  try {
    const mentor = await Mentor.findById(userId)
    // Only the information shown in the dashboard is too be passed
    return res.status(200).json({ success: true, mentees: mentor.mentees })
  } catch (err) {
    return res.status(200).json({ success: false, msg: 'User not found' })
  }
}

// This function deletes mentee account
exports.deleteacc = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.body.mentorId)
    if (mentor) {
      await Mentor.deleteOne({ _id: req.body.mentorId })
      return res.status(200).json({ success: true, msg: 'Mentor deleted' })
    } else {
      return res.status(200).json({ success: false, msg: 'Mentor not found' })
    }
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
        return res.status(200).json({ success: false, msg: 'Server error. User not saved.' })
      }
    }

    // Now get that user's id
    const mentee = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentee)
    return res.status(200).json({
      success: true,
      userId: mentee._id,
      authToken: token,
      msg: 'Sign-in succesful!'
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
        return res.status(200).json({ success: false, msg: 'Server error. User not saved.' })
      }
    }

    // Now get that user's id
    const mentor = await Mentor.findOne({
      email: userEmail.toLowerCase()
    })

    const token = google.token(mentor)
    return res.status(200).json({
      success: true,
      userId: mentor._id,
      authToken: token,
      msg: 'Sign-in succesful!'
    })
  }
}

const {
  emailValidation,
  nameValidation,
  passwordValidation
} = require('../utils/validation')

exports.register = async (req, res) => {
  // Validate the register data
  const erroremail = emailValidation(req.body)
  const errorname = nameValidation(req.body)
  const errorpassword = passwordValidation(req.body)

  if (erroremail) {
    return res.status(200).json({
      success: false,
      msg: 'The email field entered is either blank or not a valid email.'
    })
  }

  if (errorname) {
    return res.status(200).json({
      success: false,
      msg: 'The name field entered is incorrect. The name should be atleast 2 digits long'
    })
  }

  if (errorpassword) {
    return res.status(200).json({
      success: false,
      msg: 'The password field entered is incorrect. The password should be atleast 6 digits long.'
    })
  }

  // Check if user already exists
  const emailExist = await Mentor.findOne({
    email: req.body.email.toLowerCase()
  })
  // console.log(emailExist)
  if (emailExist) {
    return res.status(200).json({
      success: false,
      msg: 'Email already exists'
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
    online: true,
    mentors: []
  })

  // console.log(user)
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
      authToken: token,
      msg: 'Registration succesful!'
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
  const erroremail = emailValidation(req.body)
  const errorpassword = passwordValidation(req.body)

  if (erroremail) {
    return res.status(200).json({
      success: false,
      msg: 'The email field entered is either blank or not a valid email.'
    })
  }

  if (errorpassword) {
    return res.status(200).json({
      success: false,
      msg: 'The password field entered is incorrect. The password should be atleast 6 digits long.'
    })
  }

  // Check if email exists
  const user = await Mentor.findOne({
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
  try {
    user.online = true
    await user.save()
    const TOKEN_SECRET = process.env.TOKEN_SECRET
    const token = jwt.sign({
      _id: user._id
    }, TOKEN_SECRET)
    res.status(200).json({
      success: true,
      userId: user._id,
      authToken: token,
      msg: 'Login sucessful!'
    })
  } catch (err) {
    res.status(200).json('Login unsuccesful')
  }
}
