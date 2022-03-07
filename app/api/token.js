const { existsOrError } = require('../config/validators')
const COD = require('../config/jsonCod')
const bcrypt = require('bcrypt-node')
const jwt = require('jwt-simple')
const { env } = process
const { noPass } = require('../config/utils')

module.exports = app => {
	const create = async (req, res) => {
		let { email, password } = req.body

		try {
			existsOrError(email, COD.MISSING_INFO('Email', COD.M))
			existsOrError(password, COD.MISSING_INFO('Senha', COD.F))
		} catch (err) {
			return res.status(500).send(err)
		}

		let user = await app.db('users').where({ email }).first()
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.json(COD.INCORRECT_LOGIN())
		}

		const issuedAt = parseInt(Date.now() / 1000)
		let payload = {
			...user,
			iet: issuedAt,
			exp: issuedAt + 60 * 60 * 24
		}
		const token = jwt.encode(payload, env.AUTH_SECRET)
		return res.json({ ...noPass(user), token })
	}

	const validate = (req, res) => {
		const { token } = req.body
		try {
			const payload = jwt.decode(token, env.AUTH_SECRET)
			return res.json(noPass(payload))
		} catch (err) {
			return res.json(COD.INVALID_TOKEN())
		}
	}

	return { create, validate }
}
