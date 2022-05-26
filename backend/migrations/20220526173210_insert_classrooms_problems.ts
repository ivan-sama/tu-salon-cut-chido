import { Knex } from 'knex';

const labels = [
  'Butacas en mal estado',
  'Enchufes en mal estado',
  'Puerta dañada',
  'Falso contacto',
  'Lamparas dañadas',
  'Ventilador dañado',
  'Pizarrón roto',
];

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
