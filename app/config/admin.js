module.exports = middleware => {
   return (req, res, next) => {
      if (req.user.admin) {
         return middleware(req, res, next)
      }
      res.sendStatus(401)
   }
}
