import db from '../knex';

/**
 * Creates complaints for the given user and classroom
 *
 * @remarks
 * Deletes complaints that are not in classroomProblemsId for the given user and classroom.
 *
 */

const setComplaints = async (
  userId: number,
  classroomName: string,
  classroomProblemsId: number[],
): Promise<void> => {
  const inserts = classroomProblemsId.map((classroomProblemId) => ({
    fk_user: userId,
    fk_classroom: classroomName,
    fk_classroom_problem: classroomProblemId,
  }));

  const trx = await db.transaction();

  console.log(inserts);

  try {
    await db('classroom_complaints')
      .transacting(trx)
      .del()
      .where({ fk_user: userId, fk_classroom: classroomName });

    if (inserts.length > 0) {
      await db('classroom_complaints').transacting(trx).insert(inserts);
    }

    await trx.commit();
  } catch (err) {
    trx.rollback(err);
    throw err;
  }
};

interface IGetComplaintsWithCheckedByUserOutput {
  label: string;
  count: string;
  checked: boolean;
}

const getComplaintsWithCheckedByUser = async (
  classroomName: string,
  userId: number | null,
): Promise<IGetComplaintsWithCheckedByUserOutput[]> => {
  if (userId == null) {
    const complaints = await getComplaints(classroomName);
    return complaints.map((complaint) => {
      const result = complaint as IGetComplaintsWithCheckedByUserOutput;
      result.checked = false;
      return result;
    });
  }

  const promise1 = getComplaints(classroomName);
  const promise2 = getUserComplaints(classroomName, userId);

  const [complaints, userComplaints] = await Promise.all([promise1, promise2]);

  return complaints.map((complaint) => {
    const result = complaint as IGetComplaintsWithCheckedByUserOutput;
    result.checked = userComplaints.includes(result.label);
    return result;
  });
};

const classroomExists = async (classroomName: string): Promise<boolean> => {
  const result = (await db.select(
    db.raw('exists(select 1 from classrooms where id=?)', classroomName),
  )) as any[];

  return result.at(0).exists;
};

const getComplaints = async (
  classroomName: string,
): Promise<{ label: string; count: string }[]> => {
  const result = db('classroom_problems')
    .leftJoin('classroom_complaints', function () {
      this.on(
        'classroom_problems.id',
        'classroom_complaints.fk_classroom_problem',
      ).andOnVal('classroom_complaints.fk_classroom', classroomName);
    })
    .count('classroom_complaints.fk_classroom_problem')
    .select('classroom_problems.label', 'id')
    .groupBy('classroom_problems.label', 'id');

  return result;
};

const getUserComplaints = async (
  classroomName: string,
  userId: number,
): Promise<string[]> => {
  const result = db('classroom_complaints')
    .join(
      'classroom_problems',
      'classroom_problems.id',
      'classroom_complaints.fk_classroom_problem',
    )
    .pluck('classroom_problems.label')
    .where({ fk_classroom: classroomName, fk_user: userId });

  return result;
};

export {
  getComplaints,
  getUserComplaints,
  getComplaintsWithCheckedByUser,
  setComplaints,
  classroomExists,
};
