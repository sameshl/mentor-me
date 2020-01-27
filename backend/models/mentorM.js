const mongoose = require('mongoose')

const MenteeID = new mongoose.Schema({
  menteeid: String
})

const Skills = new mongoose.Schema({
  mentorskills: String
})

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
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

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Mentors', mentorSchema)
