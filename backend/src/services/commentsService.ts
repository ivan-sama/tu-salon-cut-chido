import db from '../knex';

const setComment = async (
  userId: number,
  classroomId: string,
  comment: string,
) => {
  await db('classroom_comments')
    .insert({
      fk_user: userId,
      fk_classroom: classroomId,
      comment,
    })
    .onConflict(['fk_user', 'fk_classroom'])
    .merge();
};

const deleteComment = async (userId: number, classroomId: string) => {
  await db('classroom_comments')
    .del()
    .where({ fk_user: userId, fk_classroom: classroomId });
};

const getComment = async (
  userId: number,
  classroomId: string,
): Promise<string | null> => {
  const rows = await db('classroom_comments')
    .pluck('comment')
    .where({ fk_user: userId, fk_classroom: classroomId });

  return rows.at(0) ?? null;
};

interface IClassroomComments {
  email: string;
  comment: string;
  updated_at: Date;
}

const getClassroomComments = async (
  classroomId: string,
): Promise<IClassroomComments[]> => {
  return await db('classroom_comments')
    .join('users', 'users.id', '=', 'classroom_comments.fk_user')
    .select('comment', 'email', 'classroom_comments.updated_at')
    .where({ fk_classroom: classroomId })
    .orderBy('classroom_comments.updated_at', 'desc');
};

export { setComment, deleteComment, getComment, getClassroomComments };
