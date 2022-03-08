const TABLE = 'users'
const { existsOrError, equalsOrError, notExists } = require('../config/validators')
const COD = require('../config/jsonCod')
const {
   encryptPass,
   first,
   getDate,
   isLogged,
   isAdmin,
   noPass
} = require('../config/utils')

module.exports = app => {
   const get = async (req, res) => {
      const { id } = req.params
      const { offset = 0, limit = 10 } = req.body

      if (id) {
         const user = await app.db(TABLE).where({ id }).first()
         return res.json(noPass(user))
      } else {
         const users = await app.db(TABLE).offset(offset).limit(limit)
         return res.json({ offset, limit, count: users.length, users: noPass(users) })
      }
   }

   const post = async (req, res) => {
      let { name, email, birthDate, password, confirmPassword, admin } = req.body

      if (!isLogged(req)) {
         admin = false
      } else if (!isAdmin(req)) {
         return res.sendStatus(401)
      }

      try {
         existsOrError(name, COD.MISSING_INFO('Nome', COD.M))
         existsOrError(email, COD.MISSING_INFO('Email', COD.M))
         existsOrError(password, COD.MISSING_INFO('Senha', COD.F))
         existsOrError(confirmPassword, COD.MISSING_INFO('Confirmação de Senha', COD.F))
         equalsOrError(password, confirmPassword, COD.DIFFERENT_INFO('Senhas'))
      } catch (err) {
         return res.status(400).json(err)
      }

      try {
         let user = await app.db(TABLE).where({ email }).first()
         if (user) {
            return res.json(COD.ALREADY_REGISTERED('Email'))
         }
      } catch (err) {
         return res.status(500).send(err)
      }

      password = encryptPass(password)
      birthDate = getDate(birthDate)

      app.db(TABLE)
         .insert({ name, email, birthDate, password, admin }, [
            'id',
            'name',
            'email',
            'birthDate',
            'admin'
         ])
         .then(user => {
            if (notExists(user)) {
               return res.status(500).json(COD.UNREGISTERED('Usuário', COD.M))
            }
            return res.json(first(user))
         })
         .catch(err => {
            return res.status(500).send(err)
         })
   }

   const put = (req, res) => {}

   const remove = async (req, res) => {
      const { id } = req.params

      if (!isAdmin(req) && req.user.id != id) {
         return res.sendStatus(401)
      }

      if (notExists(id)) {
         return res.status(400).json(COD.MISSING_INFO('Id', COD.M))
      }

      let user = await app.db(TABLE).where({ id }).first()
      if (notExists(user)) {
         return res.status(400).json(COD.REGISTRY_NOT_EXIST('Usuário'))
      }

      try {
         user = await app
            .db(TABLE)
            .where({ id })
            .del(['id', 'name', 'email', 'birthDate', 'admin'])
         return res.json(first(user))
      } catch (err) {
         return res.status(500).send(err)
      }
   }

   return { get, post, put, remove }
}
