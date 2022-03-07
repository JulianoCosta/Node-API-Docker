const bcrypt = require('bcrypt-node')

const encryptPass = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const first = v => {
	if (Array.isArray(v)) {
		return v[0]
	}
	return v
}

const getDate = string => {
	try {
		let [day, month, year] = string.split('/')
		return new Date(`${month} ${day} ${year}`)
	} catch (err) {
		return null
	}
}

const isLogged = req => {
	return !!req.user
}

const isAdmin = req => {
	return req.user && req.user.admin
}

const noPass = obj => {
	if (Array.isArray(obj)) {
		return obj.map(noPass)
	}
	let { password, ...rest } = obj
	return rest
}

module.exports = { encryptPass, first, getDate, isLogged, isAdmin, noPass }
