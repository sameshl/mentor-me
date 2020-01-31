const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
connectDB()
const Mentee = require('./models/menteeM')
const Mentor = require('./models/mentorM')

const createObj = new Mentor({
  name: 'SarveshS',
  email: 'SarveshS@gmail.com',
  password: 'Sarvesh',
  skills: [{ mentorskills: 'Javascript' }, { mentorskills: 'Express' }, { mentorskills: 'Backend' }],
  mentors: [{ menteeid: '5e349da5ad127655b15eeb4c' }, { menteeid: '5e349d90ad127655b15eeb49' }],
  online: true
})
console.log('HI')

async function saveuser () {
/*   console.log('HI')
  await createObj.save()
  console.log('Saved') */
  const user = await Mentor.findOne({ email: 'SarveshS@gmail.com' })
  console.log(user)
}

saveuser()
