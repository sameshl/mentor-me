// Set of apis for the mentee side
const mentee = require('../controllers/menteec')
const both = require('../controllers/bothc')
const verify = require('../utils/verifyToken')
const router = require('express').Router()

// Registration for mentees
router.post('/register', mentee.register)

// Login for mentees
router.post('/login', mentee.login)

// get the list of mentors for a given mentee
router.get('/getallmentors', verify, mentee.getAllMentors)

// Ask for a new mentor
router.post('/newmentor', verify, mentee.newmentor)

// Initiate chatbox
// router.get('/mentee/chatbox', verify, both.chatox)

// Delete account
router.delete('/deleteacc', verify, mentee.deleteacc)

// @route   GET api/mentee/login/google
// @desc    route for google Oauth 2 login
router.get('/login/google', mentee.googleAuth)

// @route   GET api/mentee/login/google/auth/google/callback
// @desc    route for getting user data and redirecting to dashboard
router.get('/login/google/auth/google/callback', mentee.googleAuthCallback)

// @route   POST api/login/google/android
// @desc    route for android client to send oauth tokens in body
//          and get user id and json web token in response
router.post('/android', mentee.googleandroidlogin)

module.exports = router
