const admin = require('../config/admin')

module.exports = app => {
   app.route('/register').post(app.api.users.post)
   app.route('/login').post(app.api.token.create)
   app.route('/token/validate').post(app.api.token.validate)

   app.route('/user')
      .all(app.config.passport.authenticate())
      .get(app.api.users.get)
      .post(admin(app.api.users.post))
      .delete(app.api.users.remove)

   app.route('/user/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.users.get)
      .put(app.api.users.put)
      .delete(app.api.users.remove)

   app.route('/pet')
      .all(app.config.passport.authenticate())
      .get(app.api.pet.get)
      .post(app.api.pet.post)
      .delete(app.api.pet.remove)

   app.route('/pet/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.pet.get)
      .put(app.api.pet.put)
      .delete(app.api.pet.remove)
}
