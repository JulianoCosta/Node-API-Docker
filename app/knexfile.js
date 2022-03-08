const { env } = process

module.exports = {
   client: 'postgresql',
   connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_DATABASE,
      user: env.DB_USER,
      password: env.DB_PASSWORD
   },
   pool: {
      min: 2,
      max: 10
   },
   migrations: {
      tableName: 'knex_migrations'
   }
}
