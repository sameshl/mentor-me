// Set of apis for the mentee side
const mentee = require('../controllers/menteec')
const both = require('../controllers/bothc')
const verify = require('../utils/verifyToken')
const router = require('express').Router()

// Registration for mentees
router.post('/register', mentee.register)

// Login for mentees
router.post('/login', mentee.login)

// Dashboard for mentees
router.get('/dashboard', verify, mentee.dashboard)

// Ask for a new mentor
router.post('/newmentor', verify, mentee.query)

// Initiate chatbox
// router.get('/mentee/chatbox', verify, both.chatox)

// Delete account
router.delete('/deleteacc', verify, mentee.deleteacc)

// @route   GET api/login/google/
// @desc    route for google Oauth 2 login
router.get('/google', both.googleapi)

// @route   GET api/login/google/auth/google/callback
// @desc    route for getting user data and redirecting to dashboard
router.get('/auth/google/callback', mentee.googlelogin)

// @route   POST api/login/google/android
// @desc    route for android client to send oauth tokens in body
//          and get user id and json web token in response
router.post('/android', mentee.googleandroidlogin)

module.exports = router
