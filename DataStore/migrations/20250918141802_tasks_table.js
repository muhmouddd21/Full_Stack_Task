/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('tasks', function(table) {

    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.enum('status', ['Pending', 'In Progress', 'Completed']).notNullable().defaultTo('Pending');
    table.date('due_date'); // i made it optional
    // Foreign key to link tasks to users
    table.integer('user_id').unsigned().notNullable();
    
    // if a user is deleted, all their tasks will be deleted .
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};