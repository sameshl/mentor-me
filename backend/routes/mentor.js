// Set of apis for the mentor side
module.exports = () => {
  const mentor = require('../controllers/mentorc')
  const both = require('../controllers/bothc')
  const verify = require('../utils/verifyToken')
  const router = require('express').Router()
  // Registration for mentors
  router.post('/mentor/register', mentor.register)

  // Login for mentors
  router.post('/mentor/login', mentor.login)

  // Dashboard for mentor
  router.get('/mentor/dashboard', verify, mentor.dashboard)

  // Initiate chat
  // router.get('/mentor/chatbox', verify, both.chatbox)

  // Delete account
  router.delete('/mentor/deleteacc', verify, mentor.deleteacc)

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
}
