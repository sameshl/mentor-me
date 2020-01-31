// Middleware function to create private routes by using json web tokens

const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.header('authToken')
  if (!token) {
    return res.status(401).json({
      error: 'Access Denied'
    })
  }
  try {
    const TOKEN_SECRET = process.env.TOKEN_SECRET
    const verified = jwt.verify(token, TOKEN_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({
      error: 'Invalid token'
    })
  }
}
