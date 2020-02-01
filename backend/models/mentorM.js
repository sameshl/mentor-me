const mongoose = require('mongoose')
var Schema = mongoose.Schema

const MenteeID = new Schema({
  menteeEmail: String
})

const Skills = new Schema({
  mentorskills: String
})

const mentorSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255
  },

  email: {
    type: String,
    required: true,
    max: 255
  },

  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },

  mentees: [MenteeID],

  available: {
    type: Boolean,
    default: true
  },

  skills: [Skills],

  online: {
    type: Boolean
  },

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports.mentors = mongoose.model('mentors', mentorSchema)
module.exports.menteeid = mongoose.model('menteeid', MenteeID)
