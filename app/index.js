require('dotenv').config()
const app = require('express')()
const db = require('./config/db')
const consign = require('consign')()
const { env } = process

app.db = db

consign
	.then('./config/passport.js')
	.then('./config/middlewares.js')
	.then('./api')
	.then('./config/routes.js')
	.into(app)

app.listen(env.API_PORT, () => {
	console.log(`API Online  -  ${env.API_PORT}`)
})
