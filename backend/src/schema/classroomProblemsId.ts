import * as yup from 'yup';

const classroomProblemsIdSchema = yup.object().shape({
  classroomProblemsId: yup.array().of(yup.number().integer()).required(),
});

export { classroomProblemsIdSchema };
