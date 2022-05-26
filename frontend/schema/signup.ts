import * as yup from 'yup';

const signupSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email requerido')
    .email('Debe de ser un correo institucional')
    .matches(
      /^.+@(alumno|alumnos).udg.mx$/,
      'Debe de ser un correo institucional',
    ),

  password: yup
    .string()
    .min(8, 'La contraseña debe contener por lo menos 8 caracteres')
    .max(60, 'La contraseña no puede tener más de 60 caracteres')
    .required('Contraseña requerida'),

  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Las contraseñas deben coincidir'),
});

export { signupSchema };
