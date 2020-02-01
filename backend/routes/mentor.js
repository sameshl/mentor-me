// Set of apis for the mentor side
const mentor = require('../controllers/mentorc')
const both = require('../controllers/bothc')
const verify = require('../utils/verifyToken')
const router = require('express').Router()

// Registration for mentors
router.post('/register', mentor.register)

// Login for mentors
router.post('/login', mentor.login)

// get the list of mentors for a given mentee
router.get('/getallmentees', verify, mentor.getAllMentees)

// Dashboard for mentor
router.get('/dashboard', verify, mentor.dashboard)

// Fetch mentee email
router.get('/fetchemail', verify, mentor.fetchemail)

// Switch the availaibilty of mentors
router.post('/available', verify, mentor.available)

// Initiate chat
// router.get('/mentor/chatbox', verify, both.chatbox)

// @route   GET api/mentor/login/google
// @desc    route for google Oauth 2 login
router.get('/login/google', mentor.googleAuth)

// @route   GET api/mentor/login/google/auth/google/callback
// @desc    route for getting user data and redirecting to dashboard
router.get('/login/google/auth/google/callback', mentor.googleAuthCallback)

// Delete account
router.delete('/deleteacc', verify, mentor.deleteacc)

// @route   GET api/login/google/
// @desc    route for google Oauth 2 login
router.get('/google', both.googleapi)

// @route   GET api/login/google/auth/google/callback
// @desc    route for getting user data and redirecting to dashboard
router.get('/auth/google/callback', mentor.googlelogin)

// @route   POST api/login/google/android
// @desc    route for android client to send oauth tokens in body
//          and get user id and json web token in response
router.post('/android', mentor.googleandroidlogin)

module.exports = router
