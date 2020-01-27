const Mentor = require('../models/mentorM')
// Better matching algorithms are to be updated here.
exports.match = (skills) => {
  const mentorid = find(skills)
  if (mentorid) {
    return mentorid
  } else {
    return null
  }
  // A timeout is to be set before which the mentor has to respond before which a new mentor is to be matched.
}

async function find (skills) {
  // findOne will return only the first document it checks correctly so there can be better solutions.
  const mentor = await Mentor.findOne({ skills: { $all: skills } })
  return mentor._id
}

/* async function findv2 (skills) {
  var mentors = await Mentor.find({ skills: { $all: skills } })
  // Filter the mentors array obtained above for more accurate results.
  return mentor._id
} */
