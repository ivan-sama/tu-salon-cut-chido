import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('classroom_complaints', function (table) {
    table
      .integer('fk_user')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade');

    table
      .string('fk_classroom')
      .notNullable()
      .references('id')
      .inTable('classrooms')
      .onDelete('cascade')
      .onUpdate('cascade');

    table
      .integer('fk_classroom_problem')
      .notNullable()
      .references('id')
      .inTable('classroom_problems')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamps(true, true);

    table.primary(['fk_user', 'fk_classroom', 'fk_classroom_problem']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('classroom_complaints');
}
