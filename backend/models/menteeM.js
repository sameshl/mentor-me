const mongoose = require('mongoose')
var Schema = mongoose.Schema

const MentorID = new Schema({
  mentorEmail: String
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

module.exports.mentees = mongoose.model('mentees', menteeSchema)
module.exports.mentorid = mongoose.model('mentorid', MentorID)
