const Mentor = require('../models/mentorM')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const google = require('../utils/googleAuthentication')
const { google } = require('googleapis')

// This function fetches email
exports.fetchemail = async (req, res) => {
  const userid = req.body.mentorId
  try {
    const user = await Mentor.findById(userid)
    return res.status(200).json({ success: true, email: user.email })
  } catch (err) {
    return res.status(200).json({ success: false, msg: 'User not found.' })
  }
}

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

exports.available = async (req, res) => {
  try {
    const mentorid = req.body.mentorId
    const mentor = await Mentor.findById(mentorid)
    // console.log(mentor.available)
    if (mentor) {
      if (mentor.available) {
        mentor.available = false
        await mentor.save()
        // console.log(mentor.available)
        return res.status(200).json({ success: true, msg: 'Availabilty is switched off.' })
      } else {
        mentor.available = true
        await mentor.save()
        // console.log(mentor.available)
        return res.status(200).json({ success: true, msg: 'Availabilty is switched on.' })
      }
    } else {
      return res.status(200).json({ success: false, msg: 'User not found' })
    }
  } catch (err) {
    return res.status(200).json({ success: false, msg: 'Server error' })
  }
}

// Set up appropriate env variables before deploying
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL_2 = process.env.REDIRECT_URL_2

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL_2)

// Scope of data of user to access
const defaultScope = ['profile', 'email']

// This function google auth mentee account
exports.googleAuth = async (req, res) => {
  // Generate an OAuth URL and redirect there
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: defaultScope
  })
  // If redirect not possible, we can send url to frontend
  res.redirect(url)
}

// This function is callback for google auth mentee account
exports.googleAuthCallback = async (req, res) => {
  // get code from redirect url
  const code = req.query.code
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, async function (err, tokens) {
      if (err) {
        res.json('Error authenticating')
      } else {
        console.log('Successfully authenticated')
        oAuth2Client.setCredentials(tokens)
        const people = google.people({ version: 'v1', auth: oAuth2Client })
        const me = await people.people.get({
          auth: oAuth2Client,
          resourceName: 'people/me',
          personFields: 'names,emailAddresses'
        })

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
            password: 'googleauthenticated',
            skills: [],
            online: true,
            mentors: []
          })
          try {
            await mentor.save()
          } catch (err) {
            res.status(200).json({
              success: false,
              msg: err
            })
          }
        }

        // Now get that user's id
        const mentor = await Mentor.findOne({
          email: userEmail.toLowerCase()
        })

        // Create and assign a token
        const TOKEN_SECRET = process.env.TOKEN_SECRET
        const token = jwt.sign({ _id: mentor._id }, TOKEN_SECRET)
        res.status(200).json({
          success: true,
          userId: mentor._id,
          authToken: token
        })
      }
    })
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

// This function deletes mentee account
exports.getAllMentors = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.body.mentorId)
    // console.log(mentee)
    if (mentor) {
      var menteeids = mentor.mentees
      // console.log(mentorids)
      var currentMenteeDetails = []
      for (var i in menteeids) {
        var menteeId = menteeids[i].menteeid
        var mentee = await Mentor.findById(menteeId)
        var createObj = {
          mentorId: mentee._id,
          mentorName: mentee.name
        }
        currentMenteeDetails.push(createObj)
      }
      return res.status(200).json({ success: true, currentMentorDetails: currentMenteeDetails })
    } else {
      return res.status(200).json({ success: false, msg: 'MentorId is not valid' })
    }
  } catch (err) {
    console.log(err)
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
