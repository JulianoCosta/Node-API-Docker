require('dotenv').config()
const app = require('express')()
const db = require('./config/db')
const consign = require('consign')({
   verbose: require.main === module
})
const { env } = process

app.db = db
consign
   .then('./config/passport.js')
   .then('./config/middlewares.js')
   .then('./api')
   .then('./config/routes.js')
   .into(app)

if (require.main === module) {
   app.listen(env.API_PORT, () => {
      console.log(`API Online  -  ${env.API_PORT}`)
   })
} else {
   // For tests with supertest and Jest
   module.exports = app
}
