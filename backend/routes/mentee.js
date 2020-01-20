// Set of apis for the mentee side
module.exports = (app) => {
  const mentee = require('../controllers/menteec')
  const both = require('../controllers/bothc')
  const verify = require('../utils/verifyToken')

  // Registration for mentees
  app.post('/register', both.register)

  // Login for mentees
  app.post('/login', both.login)

  // Dashboard for mentees
  app.get('/dashboard', verify, mentee.dashboard)

  // Ask a query
  app.post('/query', verify, mentee.query)
}
