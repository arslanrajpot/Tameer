import * as Yup from 'yup'

export const detailsTrackerSchema = Yup.object().shape({
  completionPercentage: Yup.number('Should be in numbers').required(
    'Completion percentage is a required field.',
  ),
  description: Yup.string().required('Description is a required field.'),
  profit: Yup.number('Should be in numbers').required('Profit is a required field.'),
  revenue: Yup.number('Should be in numbers').required('Revenue  is a required field.'),
  cost: Yup.number('Should be in numbers').required('Cost is a required field.'),
  numberOfDays: Yup.number('Should be in numbers').required('Number of days is a required field.'),
})
