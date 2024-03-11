import React from 'react'
import { CForm, CCol, CFormInput, CButton, CCard, CCardBody } from '@coreui/react'
import { Formik } from 'formik'
import { addProjectSchema } from './addProject.schema'
import { useNavigate } from 'react-router-dom'
import { useCreateProjectMutation } from 'src/store/rtk-query'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setLoading } from 'src/store/slices/main'

const AddProject = () => {
  const navigation = useNavigate()
  const [createProject, createdProjectResponse] = useCreateProjectMutation()
  const dispatch = useDispatch()
  const state = useSelector((state) => state.main)
  const initialValues = {
    projectName: '',
    projectArea: 0,
    projectDescription: '',
    projectLocationCountry: '',
    projectLocationZipCode: '',
    projectLocationStreetAddress: '',
    projectStartDate: new Date().toLocaleDateString(),
    projectEstimatedDays: 0,
    projectEstimatedCost: 0,
  }

  const handleSubmit = async (values, actions) => {
    dispatch(setLoading(true))
    try {
      const response = await createProject({
        area: values.projectArea,
        completionPercentage: 0,
        description: values.projectDescription,
        estimatedCost: values.projectEstimatedCost,
        estimatedNumberOfDays: values.projectEstimatedDays,
        name: values.projectName,
        profit: 0,
        revenue: 0,
        startDate: new Date().toString(),
        status: 'ACTIVE',
        userId: state.userId,
        address: {
          streetAddress: values.projectLocationStreetAddress,
          country: values.projectLocationCountry,
          zipCode: values.projectLocationZipCode,
        },
        spentCost: 0,
        spentNumberOfDays: 0,
      }).unwrap()
      if (response) {
        actions.resetForm()
        navigation('/allProjects')
        toast.success(`${response.name || ''} Project is created.`)
      } else {
        toast.error('Something went wrong please try again later!')
        actions.resetForm()
      }
    } catch (e) {
      console.error('Something went wrong: ', e)
      toast.error('Something went wrong please try again later!')
    }
    dispatch(setLoading(false))
  }
  return (
    <>
      <CCard>
        <CCardBody>
          <h2 className="card-title text-center my-3">Add Project</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={addProjectSchema}
            onSubmit={handleSubmit}
          >
            {({ handleBlur, handleChange, values, errors, touched, handleSubmit }) => (
              <CForm method="POST" className="row g-3" onSubmit={handleSubmit}>
                <CCol md={6}>
                  <CFormInput
                    onChange={handleChange}
                    type="text"
                    label="Project Name"
                    name="projectName"
                    onBlur={handleBlur}
                    value={values.projectName}
                  />
                  {touched.projectName && errors.projectName && (
                    <div className="mt-2 text-danger mb-2">{errors.projectName}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    onChange={handleChange}
                    type="number"
                    label="Area (in feet square)"
                    name="projectArea"
                    onBlur={handleBlur}
                    value={values.projectArea}
                  />
                  {touched.projectArea && errors.projectArea && (
                    <div className="mt-2 text-danger mb-2">{errors.projectArea}</div>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormInput
                    onChange={handleChange}
                    type="text"
                    label="Description"
                    name="projectDescription"
                    onBlur={handleBlur}
                    value={values.projectDescription}
                  />
                  {touched.projectDescription && errors.projectDescription && (
                    <div className="mt-2 text-danger mb-2">{errors.projectDescription}</div>
                  )}
                </CCol>
                <CCol md={4} xs={6}>
                  <CFormInput
                    id="Country"
                    label="Country"
                    placeholder="United States."
                    name="projectLocationCountry"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.projectLocationCountry}
                  />
                  {touched.projectLocationCountry && errors.projectLocationCountry && (
                    <div className="mt-2 text-danger mb-2">{errors.projectLocationCountry}</div>
                  )}
                </CCol>
                <CCol md={4} xs={6}>
                  <CFormInput
                    id="ZipCode"
                    label="Zip Code"
                    placeholder="90210"
                    name="projectLocationZipCode"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.projectLocationZipCode}
                  />
                  {touched.projectLocationZipCode && errors.projectLocationZipCode && (
                    <div className="mt-2 text-danger mb-2">{errors.projectLocationZipCode}</div>
                  )}
                </CCol>
                <CCol md={4} xs={12}>
                  <CFormInput
                    id="StreetAddress"
                    label="Street Address"
                    placeholder="346 Panorama Ave"
                    name="projectLocationStreetAddress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.projectLocationStreetAddress}
                  />
                  {touched.projectLocationStreetAddress && errors.projectLocationStreetAddress && (
                    <div className="mt-2 text-danger mb-2">
                      {errors.projectLocationStreetAddress}
                    </div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Estimated Days"
                    name="projectEstimatedDays"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.projectEstimatedDays}
                  />
                  {touched.projectEstimatedDays && errors.projectEstimatedDays && (
                    <div className="mt-2 text-danger mb-2">{errors.projectEstimatedDays}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Estimated Cost"
                    name="projectEstimatedCost"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.projectEstimatedCost}
                  />
                  {touched.projectEstimatedCost && errors.projectEstimatedCost && (
                    <div className="mt-2 text-danger mb-2">{errors.projectEstimatedCost}</div>
                  )}
                </CCol>
                <CCol xs={12} className="text-end">
                  <CButton className="me-2" type="submit" color="success" variant="outline">
                    Add Project
                  </CButton>
                  <CButton
                    onClick={() => navigation('/dashboard')}
                    type="button"
                    color="danger"
                    variant="outline"
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CForm>
            )}
          </Formik>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddProject
