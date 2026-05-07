// Run: npm run seed:admin
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
    process.exit(1)
  }

  await mongoose.connect(MONGO_URI)
  const User = require('../models/User')

  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`)
    await mongoose.disconnect()
    return
  }

  await User.create({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: 'Admin',
    mustChangePassword: true,
  })

  console.log(`✅ Admin created: ${ADMIN_EMAIL} (mustChangePassword=true)`)
  await mongoose.disconnect()
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
