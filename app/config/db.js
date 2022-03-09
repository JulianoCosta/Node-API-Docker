const config = require('../knexfile')
const knex = require('knex')(config)

// knex.migrate
//    .latest()
//    .then(() => {
//       console.log('Knex migrate:latest (Ok)')
//    })
//    .catch(err => {
//       console.log(err)
//    })

module.exports = knex
