exports.up = function (knex) {
   return knex.schema.createTable('users', table => {
      table.increments('id').notNullable().unique()
      table.string('email', 100).unique()
      table.string('name', 100).notNullable()
      table.string('password').notNullable()
      table.date('birthDate')
      table.boolean('admin')
   })
}

exports.down = function (knex) {
   return knex.schema.dropTable('users')
}
