const { match } = require('../utils/match')
const Mentee = require('../models/mentee')
const Mentor = require('../models/mentor')

// This function sends the user data of the user logged in
exports.dashboard = async (req, res) => {
  const userId = req.header('userId')
  if (!userId) return res.status(500).json({ error: 'userId not provided' })
  try {
    const mentee = await Mentee.findbyId(userId)
    res.status(200).json(mentee)
  } catch (err) {
    res.status(500).json({ error: 'User not found' })
  }
}

// This function matches a mentor and then saves it in the database
exports.query = async (req, res) => {
  // Front end should pass appropriate data so as to find mentee whose mentor has to be found(Session)
  try {
    // Get mentorId from match function
    const mentorID = match(req.body('skills'))
    if (mentorID) {
      // Saving mentor-mentee links in database
      await Mentee.findById(req.header('menteeId')).mentors.push(mentorID)
      await Mentor.findbyId(mentorID).mentees.push(req.header('menteeId'))
      res.status(200).json(mentorID) // Send back the mentorId to initiate chat
    } else {
      res.status(400).json({ error: 'Mentor not found' })
    }
    // mentorID is Id of the mentor matched to the mentee and its value is saved in the mentee database
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}
