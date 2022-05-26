import * as yup from 'yup';

const paginationSchema = yup.object().shape({
  page: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .transform((value) => (value ? parseInt(value) : null)),

  limit: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .transform((value) => (value ? parseInt(value) : null)),
});

export { paginationSchema };
