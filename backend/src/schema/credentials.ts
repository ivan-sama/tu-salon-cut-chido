import * as yup from 'yup';

const credentialsSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email requerido')
    .lowercase()
    .email('Email es invalido')
    .matches(
      /^.+@(alumno|alumnos).udg.mx$/,
      'Debe de ser un correo institucional',
    ),
  password: yup
    .string()
    .min(8, 'La contraseña debe contener por lo menos 8 caracteres')
    .max(60, 'La contraseña no puede tener más de 60 caracteres')
    .required('Contraseña requerida'),
});

export { credentialsSchema };
