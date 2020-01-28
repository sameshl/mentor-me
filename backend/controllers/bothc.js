/* const Mentor = require('../models/mentorM')
const Mentee = require('../models/menteeM') */
const google = require('../utils/googleAuthentication')

/* exports.chatbox = async (req, res) => {
  // 1.The mentor has accepted the request.
  // 2.The chat is initiated.
  // 3.mentorID is Id of the mentor matched to the mentee and its value is saved in the mentee database.
  // 4.Front-end should send mentorid of existing mentor(if any) so as to destroy that relationship.

  const mentorID = req.body('mentorID')
  const menteeID = req.body('menteeID')

  // Initiate chat using the above data

  const mentor = await Mentor.findOne({ _id: mentorID })
  const mentee = await Mentee.findOne({ _id: menteeID })

  await mentee.mentors.push(mentor)
  await mentor.mentors.push(mentee)

  if (req.headers.mentorID) {
    // Remove the mentors and mentees from each others list
  }
}
 */
exports.googleapi = async (req, res) => {
  try {
    google.googleapi(req, res)
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
