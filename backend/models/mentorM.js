const mongoose = require('mongoose')
var Schema = mongoose.Schema

const MenteeID = new Schema({
  menteeid: String
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

  skills: [Skills],

  online: {
    type: Boolean
  },

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('mentors', mentorSchema)
