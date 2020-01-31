const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
connectDB()
const Mentee = require('./models/menteeM')

const createObj = new Mentee({
  name: 'SarveshS',
  email: 'Sarvesh@gmail.com',
  password: 'Sarvesh',
  skills: [{ menteeskills: 'Javascript' }, { menteeskills: 'Express' }, { menteeskills: 'Backend' }],
  mentors: [{ mentorid: '5e349da5ad127655b15eeb4c' }, { mentorid: '5e349d90ad127655b15eeb49' }],
  online: true
})
console.log('HI')

async function saveuser () {
  console.log('HI')
  await createObj.save()
  console.log('Saved')
  const user = await Mentee.findOne({ email: 'Sarvesh@gmail.com' })
  console.log(user)
}

saveuser()
