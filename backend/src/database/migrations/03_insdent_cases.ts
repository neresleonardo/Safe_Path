  
import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('insident_cases', (table) => {
    table.increments('id').primary();

    table.integer('insident_id').notNullable().references('id').inTable('insidents');
    table.integer('case_id').notNullable().references('id').inTable('cases');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('insident_cases');
}