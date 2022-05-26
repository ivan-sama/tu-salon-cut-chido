import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments();
    table.text('email').unique();
    table.text('hashed_password');
    table.boolean('is_admin').defaultTo(false);
    table.timestamp('email_validated_at');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
