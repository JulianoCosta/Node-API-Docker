const passport = require('passport')
const { ExtractJwt, Strategy } = require('passport-jwt')
const { env } = process

module.exports = app => {
	const config = {
		secretOrKey: env.AUTH_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
	}
	let strategy = new Strategy(config, (payload, done) => {
		app.db('users')
			.where({ id: payload.id })
			.first()
			.then(user => done(null, user ? { ...payload } : false))
			.catch(err => done(err, false))
	})
	passport.use(strategy)

	return {
		authenticate() {
			return passport.authenticate('jwt', { session: false })
		}
	}
}
