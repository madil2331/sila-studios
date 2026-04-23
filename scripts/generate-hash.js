// Run: node scripts/generate-hash.js yourpasswordhere
// Copy the output hash and set it as ADMIN_PASSWORD_HASH in Vercel env vars

const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/generate-hash.js yourpassword')
  process.exit(1)
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters')
  process.exit(1)
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\n✅ Password hash generated successfully!\n')
  console.log('ADMIN_PASSWORD_HASH=' + hash)
  console.log('\nAdd this to your Vercel environment variables.')
  console.log('Also add to your local .env.local file for development.\n')
})
