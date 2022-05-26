import db from '../knex';

export const getClassrooms = async () => {
  const result = await db('classrooms').pluck('id');
  return result;
};

export const getWorstClassrooms = async (limit: number = 5) => {
  const result = await db('classroom_complaints')
    .select('fk_classroom')
    .count('fk_classroom')
    .groupBy('fk_classroom')
    .orderBy('count', 'desc')
    .limit(limit);

  return result;
};

export const resetClassroom = async (classroomId: string) => {
  const trx = await db.transaction();

  try {
    const deleteCommentsPromise = db('classroom_comments')
      .del()
      .where({ fk_classroom: classroomId });

    const deleteComplaintsPromise = db('classroom_complaints')
      .transacting(trx)
      .del()
      .where({ fk_classroom: classroomId });

    await Promise.all([deleteCommentsPromise, deleteComplaintsPromise]);
    await trx.commit();
  } catch (err) {
    trx.rollback(err);
    throw err;
  }
};
