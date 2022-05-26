import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('classroom_problems', function (table) {
    table.increments();
    table.text('label');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('classroom_problems');
}
