const mongoose = require('mongoose')

const MentorID = new mongoose.Schema({
  mentorid: String
})

const Skills = new mongoose.Schema({
  menteeskills: String
})

const menteeSchema = new mongoose.Schema({
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

  mentors: [MentorID],

  skills: [Skills],

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Mentees', menteeSchema)
