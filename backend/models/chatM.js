const mongoose = require('mongoose')
var Schema = mongoose.Schema

const message = new Schema({
  flag: Boolean,
  chats: String,
  date: {
    typ: Date,
    default: Date.now
  }
})

const Chat = new Schema({
  mentorid: String,
  menteeid: String,
  chat: [message]
})

module.exports = mongoose.model('chats', Chat)
