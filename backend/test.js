// const dotenv = require('dotenv')
// dotenv.config()
// const connectDB = require('./config/db')
// connectDB()
// const { mentees } = require('./models/menteeM')
// const { mentors } = require('./models/mentorM')
// const Mentee = mentees
// const Mentor = mentors
var ObjectId = require('mongoose').Types.ObjectId
// const createObj = new Mentor({
//   name: 'SarveshShinde1',
//   email: 'SarveshShinde1@gmail.com',
//   password: 'Sarvesh',
//   skills: [{ mentorskills: 'Javascript' }, { mentorskills: 'Python' }, { mentorskills: 'Backend' }],
//   mentees: [{ menteeid: '5e349da5ad127655b15eeb4c' }, { menteeid: '5e349d90ad127655b15eeb49' }],
//   online: true
// })
// console.log('HI')

// async function saveuser () {
//   console.log('HI')
//   await createObj.save()
//   console.log('Saved')
//   const user = await Mentor.findOne({ email: 'SarveshShinde@gmail.com' })
//   console.log(user)
// }

// saveuser()
console.log(ObjectId.isValid('"5e355bd4e4e79f40af159e32"'))
