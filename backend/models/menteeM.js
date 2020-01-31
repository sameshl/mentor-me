const mongoose = require('mongoose')
var Schema = mongoose.Schema

const MentorID = new Schema({
  mentorid: String
})

const Skills = new Schema({
  menteeskills: String
})

const menteeSchema = new Schema({
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

  mentors: [MentorID],

  skills: [Skills],

  online: {
    type: Boolean
  },

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Mentees', menteeSchema)
