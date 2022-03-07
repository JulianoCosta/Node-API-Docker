const TABLE = 'pet'
const { existsOrError, notExists } = require('../config/validators')
const COD = require('../config/jsonCod')
const { getDate, isAdmin, noPass } = require('../config/utils')

module.exports = app => {
	const get = async (req, res) => {
		let { id } = req.params
		let { offset = 0, limit = 10 } = req.query

		if (id) {
			const pet = await app.db(TABLE).where({ id }).first()
			return res.json(pet)
		} else {
			const pets = await app.db(TABLE).offset(offset).limit(limit)
			return res.json({ offset, limit, count: pets.length, pets })
		}
	}

	const post = async (req, res) => {
		let { name, birthDate, userId } = req.body

		if (!isAdmin(req) && req.user.id != userId) {
			return res.sendStatus(401)
		}

		try {
			existsOrError(name, COD.MISSING_INFO('Nome', COD.M))
		} catch (err) {
			return res.status(400).json(err)
		}
		let user
		if (userId) {
			user = await app.db('users').where({ id: userId }).first()
			if (!user) {
				return res.status(400).json(COD.REGISTRY_NOT_EXIST('Usuário'))
			}
		}
		birthDate = getDate(birthDate)

		app.db(TABLE)
			.insert({ name, birthDate, userId }, ['name', 'birthDate'])
			.then(pet => res.json({ ...pet[0], user: noPass(user) }))
			.catch(err => res.status(500).send(err))
	}

	const put = (req, res) => {}

	const remove = async (req, res) => {
		const { id } = req.params

		if (notExists(id)) {
			return res.json(COD.MISSING_INFO('Id', COD.M))
		}

		let pet
		try {
			pet = await app.db(TABLE).where({ id }).first()
		} catch (err) {
			return res.status(500).send(err)
		}
		if (!pet) {
			return res.json(COD.REGISTRY_NOT_EXIST('Pet'))
		}
		if (!isAdmin(req) && req.user.id != pet.userId) {
			return res.sendStatus(401)
		}

		app.db(TABLE)
			.where({ id })
			.del()
			.then(pet => res.json(pet))
			.catch(err => res.status(500).send(err))
	}

	return { get, post, put, remove }
}
