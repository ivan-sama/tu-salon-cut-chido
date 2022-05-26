import { Knex } from 'knex';

const labels = ['Sucio', 'Proyector descompuesto', 'Hacen falta butacas'];

export async function up(knex: Knex): Promise<void> {
  await knex('classroom_problems').insert(
    labels.map((label) => ({
      label,
    })),
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex('classroom_problems').del().whereIn('label', labels);
}
