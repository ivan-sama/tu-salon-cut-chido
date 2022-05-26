import { Knex } from 'knex';

export default interface ClassroomComplaint {
  fk_user: number;
  fk_classroom: number;
  fk_classroom_problem: number;
  created_at: Date;
  updated_at: Date;
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('classroom_complaints').del();

  // Inserts seed entries
  await knex('classroom_complaints').insert([
    { fk_user: 2, fk_classroom: 'A101', fk_classroom_problem: 1 },
    { fk_user: 3, fk_classroom: 'A101', fk_classroom_problem: 1 },
    { fk_user: 2, fk_classroom: 'A101', fk_classroom_problem: 2 },
  ]);
}
