/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('pet', table => {
		table.increments('id').notNullable().unique()
		table.string('name', 30).notNullable()
		table.date('birthDate')
		table
			.integer('userId')
			.references('id')
			.inTable('users')
			.onDelete('SET NULL')
			.onUpdate('CASCADE')
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('pet')
}
