import * as Yup from 'yup'

export const addProjectSchema = Yup.object().shape({
  projectName: Yup.string().required('Project name is a required field.'),
  projectArea: Yup.number('Should be in numbers').required('Project area is a required field.'),
  projectDescription: Yup.string().required('Project description is a required field.'),
  projectLocationCountry: Yup.string().required('Country is a required field.'),
  projectLocationZipCode: Yup.string().required('Zip Code is a required field.'),
  projectLocationStreetAddress: Yup.string().required('Street address is a required field.'),
  projectStartDate: Yup.string().required('Project start date is a required field.'),
  projectEstimatedDays: Yup.number('Should be in numbers').required(
    'Project estimated days is a required field.',
  ),
  projectEstimatedCost: Yup.number('Should be in numbers').required(
    'Project estimated cost is a required field.',
  ),
})
