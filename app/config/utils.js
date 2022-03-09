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
      let date = new Date(`${month} ${day} ${year}`)
      if (date.getDate()) {
         return date
      }
   } catch (err) {}
   return null
}

const isLogged = req => {
   return !!req.user
}

const isAdmin = req => {
   return !!(req.user && req.user.admin)
}

const noPass = obj => {
   if (Array.isArray(obj)) {
      return obj.map(noPass)
   }
   if (typeof obj === 'object' && !!obj) {
      let { password, ...rest } = obj
      return rest
   }
   return obj
}

module.exports = { encryptPass, first, getDate, isLogged, isAdmin, noPass }
