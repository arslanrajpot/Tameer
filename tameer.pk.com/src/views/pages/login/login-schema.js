import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Must be greater than 8 characters!')
    .max(30, 'Too Long!')
    .required('Password is a required field.'),
  email: Yup.string().email('Invalid email format').required('Email is a required field.'),
})
