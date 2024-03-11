import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CCol,
  CFormInput,
  CSpinner,
  CCardHeader,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import {
  useDeleteSingleProjectMutation,
  useCreateDetailTrackerMutation,
  useUpdateSingleDetailTrackerMutation,
  useDeleteSingleDetailTrackerMutation,
  useGetAllDetailTrackersByProjectIdQuery,
} from 'src/store/rtk-query'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil } from '@coreui/icons'
import { toast } from 'react-toastify'
import {
  setCurrentDetailTracker,
  setCurrentProject,
  setCurrentProjectPreviousStatus,
  setLoading,
} from 'src/store/slices/main'
import { Formik } from 'formik'
import { detailsTrackerSchema } from './detailTracker.schema'
import DetailTracker from 'src/components/DetailTracker'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

const ProjectDetails = () => {
  const navigate = useNavigate()
  const state = useSelector((state) => state.main)
  const dispatch = useDispatch()
  const [deleteProject] = useDeleteSingleProjectMutation()
  const [createDetailTracker] = useCreateDetailTrackerMutation()
  const [updateDetailTracker] = useUpdateSingleDetailTrackerMutation()
  const [deleteDetailTracker] = useDeleteSingleDetailTrackerMutation()
  const {
    data: detailTrackers = [],
    isLoading: detailTrackersLoading,
    isFetching: detailTrackersFetching,
    refetch: detailTrackersRefetch,
  } = useGetAllDetailTrackersByProjectIdQuery(state.currentProject._id)
  const [showDetailsTrackerModal, setShowDetailsTrackerModal] = useState(false)
  const [isDetailTrackerUpdating, setIsDetailTrackerUpdating] = useState(false)
  const [showDetailsTrackerDetailsModal, setShowDetailsTrackerDetailsModal] = useState(false)
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false)
  const [showProjectScheduleModal, setShowProjectScheduleModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSelectInputValue, setSearchSelectInputValue] = useState('description')
  const [currentPage, setCurrentPage] = useState(0)
  const [sortFieldValue, setSortFieldValue] = useState('updatedAt')
  const [ascendingSort, setAscendingSort] = useState(true)
  const itemsPerPage = 10

  const filterSelectOptions = [
    { label: 'Description', value: 'description' },
    { label: 'Revenue', value: 'revenue' },
    { label: 'Profit', value: 'profit' },
    { label: 'Cost', value: 'cost' },
    { label: 'Completion percentage', value: 'completionPercentage' },
    { label: 'Number of days', value: 'numberOfDays' },
  ]

  const sortSelectOptions = [
    {
      label: 'Last modified',
      value: 'updatedAt',
    },
    {
      label: 'Creation date',
      value: 'createdAt',
    },
    {
      label: 'Completion percentage',
      value: 'completionPercentage',
    },
    {
      label: 'Number of days',
      value: 'numberOfDays',
    },
    {
      label: 'Profit',
      value: 'profit',
    },
    {
      label: 'Revenue',
      value: 'revenue',
    },
    {
      label: 'Cost',
      value: 'cost',
    },
  ]

  const getDaysList = (days) => {
    let daysList = []
    let step = 0
    let day = 0
    let steps = Math.floor(days / 30) + 2
    while (step < steps) {
      daysList.push(day)
      day += 30
      step += 1
    }
    return daysList
  }

  const getProjectedXAxis = (days) => {
    let percentageList = []
    let percentStep = (30 / days) * 100
    let percent = 0

    while (percent < 100) {
      percentageList.push(percent)
      percent += percentStep
    }
    return percentageList
  }

  const getRealXAxis = (details) => {
    let percentageList = [0]
    let days = details.map((detail) => detail.numberOfDays)
    let percentages = details.map((detail) => detail.completionPercentage)

    let index = 0
    let remainingDays = 0
    let calculate = true
    let percent = 0

    while (index < days.length) {
      if (remainingDays > 0) {
        percent =
          (percent / 30) * remainingDays + (percentages[index] / days[index]) * (30 - remainingDays)
        remainingDays += days[index]
        calculate = false
      } else {
        remainingDays += days[index]
        if (remainingDays < 30) {
          percent = (percentages[index] / days[index]) * 30
        }
      }
      while (remainingDays >= 30) {
        if (calculate) {
          percent = (percentages[index] / days[index]) * 30
        }
        percentageList.push(percent)
        if (!calculate) {
          percent = (percentages[index] / days[index]) * 30
        }
        remainingDays -= 30
        calculate = true
      }
      index += 1
    }

    let previous = 0
    percentageList = percentageList.map((num) => {
      let answer = num + previous
      previous = answer
      return answer
    })
    return percentageList
  }

  useEffect(() => {
    if (state.currentProject == undefined || Object.keys(state.currentProject).length === 0) {
      navigate('/allProjects')
    }
  }, [state.currentProject])

  const updateProjectsLocally = (values, isUpdating) => {
    if (isUpdating) {
      dispatch(
        setCurrentProject({
          ...state.currentProject,
          profit: state.currentProject.profit - state.currentDetailsTracker.profit + values.profit,
          completionPercentage:
            state.currentProject.completionPercentage -
              state.currentDetailsTracker.completionPercentage +
              values.completionPercentage >
            100
              ? 100
              : state.currentProject.completionPercentage -
                state.currentDetailsTracker.completionPercentage +
                values.completionPercentage,
          revenue:
            state.currentProject.revenue - state.currentDetailsTracker.revenue + values.revenue,
          spentCost:
            state.currentProject.spentCost - state.currentDetailsTracker.cost + values.cost,
          spentNumberOfDays:
            parseInt(state.currentProject.spentNumberOfDays.toString()) -
            parseInt(state.currentDetailsTracker.numberOfDays.toString()) +
            parseInt(values.numberOfDays.toString()),
          ...(state.currentProject.completionPercentage -
            state.currentDetailsTracker.completionPercentage +
            values.completionPercentage >=
            100 && { status: 'COMPLETED' }),
        }),
      )
    } else {
      dispatch(
        setCurrentProject({
          ...state.currentProject,
          profit: state.currentProject.profit + values.profit,
          completionPercentage:
            state.currentProject.completionPercentage + values.completionPercentage > 100
              ? 100
              : state.currentProject.completionPercentage + values.completionPercentage,
          revenue: state.currentProject.revenue + values.revenue,
          spentCost: state.currentProject.spentCost + values.cost,
          spentNumberOfDays:
            parseInt(state.currentProject.spentNumberOfDays.toString()) +
            parseInt(values.numberOfDays.toString()),
          ...(state.currentProject.completionPercentage + values.completionPercentage >= 100 && {
            status: 'COMPLETED',
          }),
        }),
      )
    }
  }

  const deleteProjectHandle = async (event) => {
    event.stopPropagation()
    try {
      const response = await deleteProject(state.currentProject._id).unwrap()
      if (response) {
        toast.success(`Project ${state.currentProject.name} is deleted successfully!`)
        dispatch(setCurrentProject({}))
        navigate('/allProjects')
      }
    } catch (error) {
      toast.error('Something went wrong, please try again later!')
    }
  }

  const updateProjectHandle = async () => {
    navigate('/updateProject')
  }

  const updateProjectsLocallyOnDeleteDetailTracker = (detailTracker) => {
    dispatch(
      setCurrentProject({
        ...state.currentProject,
        profit: state.currentProject.profit - detailTracker.profit,
        completionPercentage:
          state.currentProject.completionPercentage - detailTracker.completionPercentage,
        revenue: state.currentProject.revenue - detailTracker.revenue,
        spentCost: state.currentProject.spentCost - detailTracker.cost,
        spentNumberOfDays:
          parseInt(state.currentProject.spentNumberOfDays.toString()) -
          parseInt(detailTracker.numberOfDays.toString()),
        ...(state.currentProject.completionPercentage - detailTracker.completionPercentage <
          100 && { status: 'ACTIVE' }),
      }),
    )
  }

  const handleDeleteDetailTracker = async (event, detailTracker) => {
    event.stopPropagation()
    try {
      updateProjectsLocallyOnDeleteDetailTracker(detailTracker)
      const response = await deleteDetailTracker({
        id: detailTracker._id,
        projectId: state.currentProject._id,
      })
      if (response) {
        toast.success('Project details object is deleted')
        dispatch(setCurrentDetailTracker({}))
        detailTrackersRefetch(state.currentProject._id)
        checkProjectStatusChangeAndNavigate(
          state.currentProject.completionPercentage - detailTracker.completionPercentage,
        )
      }
    } catch (error) {
      console.error('Something went wrong: ', error)
      toast.error('Something went wrong, please try again later!')
    }
  }
  const handleUpdateDetailTracker = (event, detailTracker) => {
    dispatch(setCurrentDetailTracker(detailTracker))
    setIsDetailTrackerUpdating(true)
    setShowDetailsTrackerModal(true)
    event.stopPropagation()
  }

  const handleClickDetailTracker = (detailTracker) => {
    dispatch(setCurrentDetailTracker(detailTracker))
    setShowDetailsTrackerDetailsModal(true)
  }

  const handleSubmit = async (values, actions) => {
    if (isDetailTrackerUpdating) {
      if (
        state.currentProject.completionPercentage -
          state.currentDetailsTracker.completionPercentage +
          values.completionPercentage >
        100
      ) {
        toast.error('Project completion percentage must be less than 100!')
        return
      }
    } else {
      if (state.currentProject.completionPercentage + values.completionPercentage > 100) {
        toast.error('Project completion percentage must be less than 100!')
        return
      }
    }
    if (values.completionPercentage < 1) {
      toast.error('Completion percentage must be greater than 1!')
      return
    }
    dispatch(setLoading(true))
    try {
      let response = {}

      if (isDetailTrackerUpdating) {
        updateProjectsLocally(values, isDetailTrackerUpdating)
        response = await updateDetailTracker({
          completionPercentage: values.completionPercentage,
          profit: values.profit,
          cost: values.cost,
          revenue: values.revenue,
          description: values.description,
          numberOfDays: values.numberOfDays,
          projectId: state.currentProject._id,
          id: state.currentDetailsTracker._id,
        }).unwrap()
      } else {
        updateProjectsLocally(values, isDetailTrackerUpdating)
        response = await createDetailTracker({
          completionPercentage: values.completionPercentage,
          profit: values.profit,
          cost: values.cost,
          revenue: values.revenue,
          description: values.description,
          numberOfDays: values.numberOfDays,
          projectId: state.currentProject._id,
        }).unwrap()
      }
      if (response) {
        actions.resetForm()
        toast.success(`Project details are ${isDetailTrackerUpdating ? 'Updated' : 'Added'}.`)
        setShowDetailsTrackerModal(false)
        detailTrackersRefetch(state.currentProject._id)
        dispatch(setLoading(false))
        if (isDetailTrackerUpdating) {
          checkProjectStatusChangeAndNavigate(
            state.currentProject.completionPercentage -
              state.currentDetailsTracker.completionPercentage +
              values.completionPercentage,
          )
        } else
          checkProjectStatusChangeAndNavigate(
            state.currentProject.completionPercentage + values.completionPercentage,
          )
      } else {
        toast.error('Something went wrong please try again later!')
        actions.resetForm()
        setShowDetailsTrackerModal(false)
        dispatch(setLoading(false))
      }
    } catch (e) {
      console.error('Something went wrong: ', e)
      toast.error('Something went wrong please try again later!')
      setShowDetailsTrackerModal(false)
      actions.resetForm()
      dispatch(setLoading(false))
    }
  }

  const addInitialValues = {
    completionPercentage: 0,
    profit: 0,
    cost: 0,
    revenue: 0,
    description: '',
    numberOfDays: 0,
  }

  const updateInitialValues = {
    completionPercentage: state.currentDetailsTracker.completionPercentage,
    profit: state.currentDetailsTracker.profit,
    cost: state.currentDetailsTracker.cost,
    revenue: state.currentDetailsTracker.revenue,
    description: state.currentDetailsTracker.description,
    numberOfDays: state.currentDetailsTracker.numberOfDays,
  }

  const computeProjectStatus = (completionPercentage) =>
    completionPercentage >= 100 ? 'COMPLETED' : 'ACTIVE'

  const checkProjectStatusChangeAndNavigate = (completionPercentage) => {
    const projectCurrentStatusLocally = computeProjectStatus(completionPercentage)
    if (state.currentProjectPreviousStatus !== projectCurrentStatusLocally) {
      projectCurrentStatusLocally === 'ACTIVE'
        ? navigate('/runningProjects')
        : navigate('/completedProjects')
      toast.warning('Project status has been changed, you are redirecting!')
      dispatch(setCurrentProjectPreviousStatus(projectCurrentStatusLocally))
    }
  }

  const HandleSearchSelectChange = (event) => {
    setSearchSelectInputValue(event.target.value)
  }

  const detailsQueryFilter = (detailTracker) => {
    if (searchQuery.length > 0) {
      if (
        searchSelectInputValue === 'description' &&
        detailTracker.description.toLowerCase().includes(searchQuery)
      )
        return true
      if (
        searchSelectInputValue === 'revenue' &&
        detailTracker.revenue.toString().toLowerCase().includes(searchQuery)
      )
        return true
      if (
        searchSelectInputValue === 'profit' &&
        detailTracker.profit.toString().toLowerCase().includes(searchQuery)
      )
        return true
      if (
        searchSelectInputValue === 'cost' &&
        detailTracker.cost.toString().toLowerCase().includes(searchQuery)
      )
        return true
      if (
        searchSelectInputValue === 'numberOfDays' &&
        detailTracker.numberOfDays.toString().toLowerCase().includes(searchQuery)
      )
        return true
      if (
        searchSelectInputValue === 'completionPercentage' &&
        detailTracker.completionPercentage.toString().toLowerCase().includes(searchQuery)
      )
        return true
    } else return true
    return false
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const offset = currentPage * itemsPerPage
  const pageCount = Math.ceil(detailTrackers.length / itemsPerPage)

  const handleSortSelectFieldChange = (event) => {
    setSortFieldValue(event.target.value)
  }

  const sortDetailsTracker = (detailsTrackerInput) =>
    detailsTrackerInput.sort((a, b) => {
      let sortValueA, sortValueB
      switch (sortFieldValue) {
        case 'updatedAt':
          sortValueA = moment(a.updatedAt).milliseconds()
          sortValueB = moment(b.updatedAt).milliseconds()
          break
        case 'createdAt':
          sortValueA = moment(a.createdAt).milliseconds()
          sortValueB = moment(b.createdAt).milliseconds()
          break
        case 'completionPercentage':
          sortValueA = a.completionPercentage
          sortValueB = b.completionPercentage
          break
        case 'cost':
          sortValueA = a.cost
          sortValueB = b.cost
          break
        case 'numberOfDays':
          sortValueA = a.numberOfDays
          sortValueB = b.numberOfDays
          break
        case 'profit':
          sortValueA = a.profit
          sortValueB = b.profit
          break
        case 'revenue':
          sortValueA = a.revenue
          sortValueB = b.revenue
          break
        default:
          // Handle the default case here
          break
      }
      if (typeof sortValueA === 'string' && typeof sortValueB === 'string') {
        sortValueA = sortValueA.toLowerCase()
        sortValueB = sortValueB.toLowerCase()

        if (sortValueA < sortValueB) {
          return ascendingSort ? -1 : 1
        }
        if (sortValueA > sortValueB) {
          return ascendingSort ? 1 : -1
        }
        return 0
      }

      if (ascendingSort) {
        return sortValueA - sortValueB
      } else {
        return sortValueB - sortValueA
      }
    })

  const paginatedDetailsTracker = sortDetailsTracker(
    detailTrackers.filter(detailsQueryFilter).slice(offset, offset + itemsPerPage),
  )

  return (
    <>
      <div className="d-lg-flex flex-column flex-lg-row justify-content-between">
        <CCard className="mb-3 col-12 col-lg-6">
          <CCardHeader>Filtering Details</CCardHeader>
          <CCardBody className="d-flex">
            <CFormSelect
              aria-label="Select filter field for Details Tracker"
              options={filterSelectOptions}
              className="me-2"
              onChange={HandleSearchSelectChange}
              value={searchSelectInputValue}
            />
            <CFormInput
              type="text"
              placeholder="Search field"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
            />
          </CCardBody>
        </CCard>
        <CCard className="mb-3 col-12 col-lg-6 mt-lg-0">
          <CCardHeader>Sorting Details</CCardHeader>
          <CCardBody className="d-flex">
            <CInputGroup>
              <CFormSelect
                aria-label="Select Sort field for Details Trackers"
                onChange={handleSortSelectFieldChange}
                value={sortFieldValue}
              >
                {sortSelectOptions.map((sortOption, index) => {
                  return (
                    <option value={sortOption.value} key={index}>
                      {sortOption.label}
                    </option>
                  )
                })}
              </CFormSelect>
              <CInputGroupText>
                <CButton
                  color={`${ascendingSort ? 'primary' : 'secondary'}`}
                  size="sm"
                  onClick={() => {
                    setAscendingSort(true)
                    sortDetailsTracker(paginatedDetailsTracker)
                  }}
                >
                  ASC
                </CButton>
              </CInputGroupText>
              <CInputGroupText>
                <CButton
                  color={`${ascendingSort ? 'secondary' : 'primary'}`}
                  size="sm"
                  onClick={() => {
                    setAscendingSort(false)
                    sortDetailsTracker(paginatedDetailsTracker)
                  }}
                >
                  DESC
                </CButton>
              </CInputGroupText>
            </CInputGroup>
          </CCardBody>
        </CCard>
      </div>
      <CCard className="mb-3">
        {/* <CCardImage orientation="top" src={completedProject} /> */}
        <CCardHeader>{state.currentProject.name}</CCardHeader>
        <CCardBody className="position-relative">
          <CCardTitle className="descriptionWidth">{state.currentProject.description}</CCardTitle>
          <CIcon
            icon={cilTrash}
            height={20}
            className="my-4 text-danger projectDeleteIcon position-absolute"
            onClick={deleteProjectHandle}
          />
          <CIcon
            icon={cilPencil}
            height={20}
            className="my-4 text-warning projectUpdateIcon position-absolute"
            onClick={updateProjectHandle}
          />
          {/* <CCardText>{state.currentProject.description}</CCardText> */}
          <CTable borderless>
            <tr>
              <td>Revenue</td>
              <td>Rs. {state.currentProject.revenue}</td>
            </tr>
            <tr>
              <td>Estimated Cost</td>
              <td>Rs. {state.currentProject.estimatedCost}</td>
            </tr>
            <tr>
              <td>Profit</td>
              <td>Rs. {state.currentProject.profit}</td>
            </tr>
            <tr>
              <td>Estimated Time</td>
              <td>{state.currentProject.estimatedNumberOfDays} days</td>
            </tr>
          </CTable>
          <div className="text-center">
            <CButton
              onClick={(event) => {
                event.stopPropagation()
                setShowProjectScheduleModal(true)
              }}
              type="button"
              color="primary"
              variant="outline"
              className="me-3"
            >
              Show Schedule
            </CButton>
            {state.currentProject.status === 'ACTIVE' && (
              <CButton
                type="button"
                color="success"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation()
                  setShowDetailsTrackerModal(true)
                  setIsDetailTrackerUpdating(false)
                }}
                className="me-3"
              >
                Add Progress Details
              </CButton>
            )}
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              onClick={() => setShowProjectDetailsModal(true)}
            >
              Show Details
            </CButton>
          </div>
        </CCardBody>
      </CCard>
      {detailTrackersLoading && detailTrackersFetching ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <CModal
            visible={showProjectScheduleModal}
            onClose={() => setShowProjectScheduleModal(false)}
            alignment="center"
          >
            <CModalHeader>
              <CModalTitle>{state.currentProject.name} Schedule</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div>
                <h5>Project Progress</h5>
                <CChart
                  type="line"
                  data={{
                    labels: getDaysList(state.currentProject.estimatedNumberOfDays),
                    datasets: [
                      {
                        label: 'Projected Percentage',
                        data: getProjectedXAxis(state.currentProject.estimatedNumberOfDays),
                        backgroundColor: 'transparent',
                        borderColor: 'blue',
                        pointHoverBackgroundColor: 'blue',
                        borderWidth: 2,
                        lineTension: 0.4,
                      },
                      {
                        label: 'Completion Percentage',
                        data: getRealXAxis(
                          detailTrackers,
                          state.currentProject.estimatedNumberOfDays,
                        ),
                        backgroundColor: 'transparent',
                        borderColor: 'green',
                        pointHoverBackgroundColor: 'blue',
                        borderWidth: 2,
                        lineTension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 10,
                        },
                      },
                    },
                  }}
                />
                <h5>Cost Comparison</h5>
                <CChart
                  type="bar"
                  data={{
                    labels: ['Project Cost'],
                    datasets: [
                      {
                        label: 'Estimated Cost',
                        backgroundColor: 'blue',
                        data: [
                          Math.round(
                            (state.currentProject.estimatedCost /
                              parseInt(state.currentProject.estimatedNumberOfDays.toString())) *
                              (parseInt(state.currentProject.spentNumberOfDays.toString()) >
                              parseInt(state.currentProject.estimatedNumberOfDays.toString())
                                ? parseInt(state.currentProject.estimatedNumberOfDays.toString())
                                : parseInt(state.currentProject.spentNumberOfDays.toString())),
                          ),
                        ],
                      },
                      {
                        label: 'Real Cost',
                        backgroundColor: '#e55353',
                        data: [state.currentProject.spentCost],
                      },
                      {
                        label: 'Profit',
                        backgroundColor: '#2eb85c',
                        data: [state.currentProject.profit],
                      },
                    ],
                  }}
                />
                <h5>Days Comparison</h5>
                <CChart
                  type="bar"
                  data={{
                    labels: ['Days'],
                    datasets: [
                      {
                        label: 'Estimated Days',
                        backgroundColor: 'blue',
                        data: [state.currentProject.estimatedNumberOfDays],
                      },
                      {
                        label: 'Spent Days',
                        backgroundColor: '#2eb85c',
                        data: [state.currentProject.spentNumberOfDays],
                      },
                      state.currentProject.estimatedNumberOfDays -
                        state.currentProject.spentNumberOfDays >=
                      0
                        ? {
                            label: 'Remaining Days',
                            backgroundColor: '#e55353',
                            data: [
                              state.currentProject.estimatedNumberOfDays -
                                state.currentProject.spentNumberOfDays,
                            ],
                          }
                        : {
                            label: 'Days Overrun',
                            backgroundColor: '#e55353',
                            data: [
                              state.currentProject.spentNumberOfDays -
                                state.currentProject.estimatedNumberOfDays,
                            ],
                          },
                    ],
                  }}
                />
              </div>
            </CModalBody>
          </CModal>
          {paginatedDetailsTracker && paginatedDetailsTracker.length > 0 && (
            <CCard className="mb-3">
              <CCardHeader>Details</CCardHeader>
              <CCardBody>
                {paginatedDetailsTracker.map((detailTracker, index) => (
                  <DetailTracker
                    key={index}
                    detailTracker={detailTracker}
                    onUpdate={handleUpdateDetailTracker}
                    onDelete={handleDeleteDetailTracker}
                    onClick={() => handleClickDetailTracker(detailTracker)}
                  />
                ))}
              </CCardBody>
            </CCard>
          )}
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      )}
      <CModal visible={showDetailsTrackerModal} onClose={() => setShowDetailsTrackerModal(false)}>
        <CModalHeader>
          <CModalTitle>{isDetailTrackerUpdating ? 'Update' : 'Add'} Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Formik
            initialValues={isDetailTrackerUpdating ? updateInitialValues : addInitialValues}
            validationSchema={detailsTrackerSchema}
            onSubmit={handleSubmit}
          >
            {({ handleBlur, handleChange, values, errors, touched, handleSubmit }) => (
              <CForm method="POST" className="row g-3" onSubmit={handleSubmit}>
                <CCol md={6}>
                  <CFormInput
                    onChange={handleChange}
                    type="number"
                    label="Profit"
                    name="profit"
                    onBlur={handleBlur}
                    value={values.profit}
                  />
                  {touched.profit && errors.profit && (
                    <div className="mt-2 text-danger mb-2">{errors.profit}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    onChange={handleChange}
                    type="number"
                    label="Revenue"
                    name="revenue"
                    onBlur={handleBlur}
                    value={values.revenue}
                  />
                  {touched.revenue && errors.revenue && (
                    <div className="mt-2 text-danger mb-2">{errors.revenue}</div>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormInput
                    onChange={handleChange}
                    type="text"
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  {touched.description && errors.description && (
                    <div className="mt-2 text-danger mb-2">{errors.description}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="Cost"
                    label="Cost"
                    name="cost"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cost}
                    type="number"
                  />
                  {touched.cost && errors.cost && (
                    <div className="mt-2 text-danger mb-2">{errors.cost}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Number of days"
                    name="numberOfDays"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.numberOfDays}
                  />
                  {touched.numberOfDays && errors.numberOfDays && (
                    <div className="mt-2 text-danger mb-2">{errors.numberOfDays}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Completion Percentage"
                    name="completionPercentage"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.completionPercentage}
                  />
                  {touched.completionPercentage && errors.completionPercentage && (
                    <div className="mt-2 text-danger mb-2">{errors.completionPercentage}</div>
                  )}
                </CCol>
                <CButton color="secondary" onClick={() => setShowDetailsTrackerModal(false)}>
                  Close
                </CButton>
                <CButton type="submit" color="primary">
                  {isDetailTrackerUpdating ? 'Update' : 'Add'}
                </CButton>
              </CForm>
            )}
          </Formik>
        </CModalBody>
      </CModal>

      <CModal
        visible={showDetailsTrackerDetailsModal}
        onClose={() => setShowDetailsTrackerDetailsModal(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardText>{state.currentDetailsTracker.description}</CCardText>
          <CTable borderless>
            <tr>
              <td>Revenue</td>
              <td>Rs. {state.currentDetailsTracker.revenue}</td>
            </tr>
            <tr>
              <td>Cost</td>
              <td>Rs. {state.currentDetailsTracker.cost}</td>
            </tr>
            <tr>
              <td>Profit</td>
              <td>Rs. {state.currentDetailsTracker.profit}</td>
            </tr>
            <tr>
              <td>Number of days</td>
              <td>{state.currentDetailsTracker.numberOfDays} days</td>
            </tr>

            <tr>
              <td>Completion percentage</td>
              <td>{state.currentDetailsTracker.completionPercentage} %</td>
            </tr>
          </CTable>
        </CModalBody>
      </CModal>

      <CModal
        visible={showProjectDetailsModal}
        onClose={() => setShowProjectDetailsModal(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>{state.currentProject.name} Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardText>{state.currentProject.description}</CCardText>
          <CTable borderless>
            <tr>
              <td>Revenue</td>
              <td>Rs. {state.currentProject.revenue}</td>
            </tr>
            <tr>
              <td>Expected Cost</td>
              <td>Rs. {state.currentProject.estimatedCost}</td>
            </tr>
            <tr>
              <td>Spent Cost</td>
              <td>Rs. {state.currentProject.spentCost}</td>
            </tr>
            <tr>
              <td>Profit</td>
              <td>Rs. {state.currentProject.profit}</td>
            </tr>
            <tr>
              <td>Estimated Number of days</td>
              <td>{state.currentProject.estimatedNumberOfDays} days</td>
            </tr>
            <tr>
              <td>Spent Number of days</td>
              <td>{state.currentProject.spentNumberOfDays} days</td>
            </tr>

            <tr>
              <td>Completion percentage</td>
              <td>{state.currentProject.completionPercentage} %</td>
            </tr>

            <tr>
              <td>Project Status</td>
              <td>{state.currentProject.status}</td>
            </tr>
          </CTable>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ProjectDetails
