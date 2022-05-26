import { Knex } from 'knex';
import Classroom from './classroom';
import ClassroomComment from './classroomComment';
import ClassroomComplaint from './classroomComplaint';
import ClassroomProblem from './classroomProblem';
import Notice from './notice';
import User from './user';

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<
      // Interface used for return type and "where", "having", etc.
      User,
      // Inserting defaults to "base" type
      // "email" and "hashed_password" are required.
      // "created_at" and "updated_at" optional.
      // "id" can't be provided.
      Pick<User, 'email' | 'hashed_password'> &
        Partial<Pick<User, 'created_at' | 'updated_at' | 'email_validated_at'>>,
      // This wil allow updating all fields except "id" and "is_admin".
      Partial<Omit<User, 'id' | 'is_admin'>>
    >;

    classrooms: Classroom;

    classroom_problems: Knex.CompositeTableType<
      ClassroomProblem,
      Partial<Omit<ClassroomProblem, 'id'>>,
      Partial<Omit<ClassroomProblem, 'id'>>
    >;

    classroom_complaints: Knex.CompositeTableType<
      ClassroomComplaint,
      Pick<
        ClassroomComplaint,
        'fk_user' | 'fk_classroom' | 'fk_classroom_problem'
      > &
        Partial<Pick<ClassroomComplaint, 'created_at' | 'updated_at'>>
    >;

    classroom_comments: Knex.CompositeTableType<
      ClassroomComment,
      Pick<ClassroomComment, 'fk_user' | 'fk_classroom' | 'comment'> &
        Partial<Pick<ClassroomComplaint, 'created_at' | 'updated_at'>>
    >;

    notices: Knex.CompositeTableType<
      Notice,
      Pick<Notice, 'document'> &
        Partial<Pick<Notice, 'is_public' | 'created_at' | 'updated_at'>>
    >;
  }
}
