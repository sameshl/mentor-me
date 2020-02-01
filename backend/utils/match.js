const Mentor = require('../models/mentorM')
// Better matching algorithms are to be updated here.
exports.match = async (skills) => {
  const mentorid = await find(skills)
  if (mentorid) {
    return mentorid
  } else {
    return null
  }
  // A timeout is to be set before which the mentor has to respond before which a new mentor is to be matched.
}

async function find (skills) {
  // findOne will return only the first document it checks correctly so there can be better solutions.
  try {
    // const mentor = await Mentor.findOne({ skills: { $all: { mentorskills: 'Javascript' } } })
    const mentor = await Mentor.findOne({ "skills.mentorskills": skills, online: true, available: true })
    // console.log(mentor._id)
    return mentor._id
  } catch (err) {
    // console.log(err)
    return null
  }
}

/* async function findv2 (skills) {
  if (skills.tech) {
    var mentors = await Mentor.find({ skills: { $all: skills.tech } })
  }
  if (mentors) {
    mentors = await mentors.find({ skills: { $all: skills.streams } })
  } else { return null }
  if (mentors) {
    mentors = await mentors.find({ skills: { $all: skills.pl } })
  } else { return null }
  if (mentors) {
    mentors = await mentors.find({ skills: { $all: skills.frameworks } })
  } else { return null }
  if (mentors) {
    return mentors[0]
  } else { return null }
  // Filter the mentors array obtained above for more accurate results.
} */
