// Set of apis for the mentor side
module.exports = (app) => {
  const mentor = require('../controllers/mentorc')
  const both = require('../controllers/bothc')

  // Registration for mentors
  app.post('/register', both.register)

  // Login for mentors
  app.post('/login', both.login)

  // Dashboard for mentor
  app.get('/dashboard', mentor.dashboard)
}
