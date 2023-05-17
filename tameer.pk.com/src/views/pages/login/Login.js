import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Formik } from 'formik'
import { loginSchema } from './login-schema'
import { useLoginMutation } from 'src/store/rtk-query'
import { useDispatch } from 'react-redux'
import { setLoading, saveToken, saveInformation } from 'src/store/slices/main'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Login = () => {
  const [login, loginResult] = useLoginMutation()
  const loadingState = useSelector((state) => state.main.loading)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const initialValues = {
    email: '',
    password: '',
  }
  const handleSubmit = async (values, actions) => {
    dispatch(setLoading(true))
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap()
      localStorage.clear()
      if (response && response.access_token) {
        actions.resetForm()
        dispatch(saveToken(response.access_token))
        dispatch(saveInformation(response))
        navigate('/dashboard')
        toast.success('Logged In.')
      }
    } catch (error) {
      toast.error(`${error.data?.message}`)
      console.error('LOGIN(): ', error)
    }
    dispatch(setLoading(false))
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ handleBlur, handleChange, values, errors, touched, handleSubmit }) => (
                      <CForm onSubmit={handleSubmit}>
                        <h1 className="text-center">Login</h1>
                        <p className="text-medium-emphasis">Sign In to your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Email"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            autoComplete="username"
                            value={values.email}
                          />
                        </CInputGroup>
                        {touched.email && errors.email && (
                          <div className="mt-2 text-danger mb-2">{errors.email}</div>
                        )}
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="password"
                            value={values.password}
                          />
                        </CInputGroup>
                        {touched.password && errors.password && (
                          <div className="mt-2 text-danger mb-2">{errors.password}</div>
                        )}
                        <CRow>
                          <CCol xs={6} className="text-left">
                            <CButton color="primary" className="px-4" type="submit">
                              {loadingState && (
                                <CSpinner color="warning" size="sm" className="me-2" />
                              )}
                              Login
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-end">
                            <CButton color="link" className="px-0" disabled>
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
