const { google } = require('googleapis')
const jwt = require('jsonwebtoken')
const config = require('config')

// Set up appropriate env variables before deploying
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

// Scope of data of user to access
const defaultScope = ['profile', 'email']

exports.googleapi = async (req, res) => {
  // Generate an OAuth URL and redirect there
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: defaultScope
  })
  res.redirect(url)
}

exports.googleauth = async (code) => {
  // Get an access token based on our OAuth code
  oAuth2Client.getToken(code, async function (err, tokens) {
    if (err) { return null } else {
      console.log('Successfully authenticated')
      oAuth2Client.setCredentials(tokens)
      const people = google.people({ version: 'v1', auth: oAuth2Client })
      const me = await people.people.get({
        auth: oAuth2Client,
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
      })
      return me
    }
  })
}

exports.googleandroidauth = async function (tokens) {
  // get token
  oAuth2Client.setCredentials(tokens)
  const people = google.people({ version: 'v1', auth: oAuth2Client })
  const me = await people.people.get({
    auth: oAuth2Client,
    resourceName: 'people/me',
    personFields: 'names,emailAddresses'
  })
  return me
}

exports.token = function (user) {
  // Create and assign a token
  const TOKEN_SECRET = config.get('tokenSecret')
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET)
  return token
}
