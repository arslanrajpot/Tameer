/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CFormInput,
  CCardText,
  CTable,
  CCardHeader,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useGetAllProjectsByUserIdQuery } from 'src/store/rtk-query'
import {
  setCurrentProject,
  setCurrentProjectPreviousStatus,
  setLoading,
  setProjects,
} from 'src/store/slices/main'
import {} from '@coreui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

const Projects = ({ status }) => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.main)
  const navigate = useNavigate()
  const {
    data: allProjects = [],
    isLoading,
    isFetching,
    refetch: refetchProjects,
  } = useGetAllProjectsByUserIdQuery(state.userId)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchSelectInputValue, setSearchSelectInputValue] = useState('name')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const [ascendingSort, setAscendingSort] = useState(true)
  const [sortFieldValue, setSortFieldValue] = useState('updatedAt')

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await refetchProjects()
      dispatch(setProjects(projects.data))
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    if (!isLoading && !isFetching) {
      dispatch(setProjects(allProjects))
    }
  }, [isLoading, isFetching])

  const showProject = (project) => {
    dispatch(setCurrentProject(project))
    dispatch(setCurrentProjectPreviousStatus(project.status))
    navigate('/showProject')
  }

  const filterSelectOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Revenue', value: 'revenue' },
    { label: 'Profit', value: 'profit' },
    { label: 'Spent number of days', value: 'spentNumberOfDays' },
    { label: 'Estimated number of days', value: 'estimatedNumberOfDays' },
    { label: 'Spent cost', value: 'spentCost' },
    { label: 'Estimated cost', value: 'estimatedCost' },
    { label: 'Description', value: 'description' },
    { label: 'Completion percentage', value: 'completionPercentage' },
    { label: 'Status', value: 'status' },
    { label: 'Street address', value: 'streetAddress' },
    { label: 'Country', value: 'country' },
    { label: 'Zip code', value: 'zipCode' },
  ]

  const sortSelectOptions = [
    {
      label: 'Last modified',
      value: 'updatedAt',
    },
    {
      label: 'Start date',
      value: 'startDate',
    },
    {
      label: 'Completion percentage',
      value: 'completionPercentage',
    },
    {
      label: 'Estimated cost',
      value: 'estimatedCost',
    },
    {
      label: 'Spent cost',
      value: 'spentCost',
    },
    {
      label: 'Estimated number of days',
      value: 'estimatedNumberOfDays',
    },
    {
      label: 'Spent number of days',
      value: 'spentNumberOfDays',
    },
    {
      label: 'Profit',
      value: 'profit',
    },
    {
      label: 'Revenue',
      value: 'revenue',
    },
  ]

  const renderProjects = () => {
    dispatch(setLoading(false))
    const handleNoFilteredProjects = () => {
      if (status === 'COMPLETED') {
        return 'No completed projects soo far!'
      }
      if (status === 'ACTIVE') {
        return 'No active projects soo far!'
      }
      if (status === 'ALL') {
        return 'No projects soo far!'
      }
    }

    const filteredProject = allProjects.filter((project) => {
      if (status === 'COMPLETED') {
        if (project.status === 'COMPLETED') return project
      }
      if (status === 'ACTIVE') {
        if (project.status === 'ACTIVE') return project
      }
      if (status === 'ALL') return project
      return false
    })

    const HandleSearchSelectChange = (event) => {
      setSearchSelectInputValue(event.target.value)
    }

    const projectsQueryFilter = (project) => {
      if (searchQuery.length > 0) {
        if (searchSelectInputValue === 'name' && project.name.toLowerCase().includes(searchQuery))
          return true
        if (
          searchSelectInputValue === 'description' &&
          project.description.toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'area' &&
          project.area.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'estimatedCost' &&
          project.estimatedCost.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'estimatedNumberOfDays' &&
          project.estimatedNumberOfDays.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'spentNumberOfDays' &&
          project.spentNumberOfDays.toString().toLowerCase().includes(searchQuery)
        )
          return true

        if (
          searchSelectInputValue === 'completionPercentage' &&
          project.completionPercentage.toString().toLowerCase().includes(searchQuery)
        )
          return true

        if (
          searchSelectInputValue === 'revenue' &&
          project.revenue.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'profit' &&
          project.profit.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'spentCost' &&
          project.spentCost.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'status' &&
          project.status.toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'streetAddress' &&
          project.address.streetAddress.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'country' &&
          project.address.country.toString().toLowerCase().includes(searchQuery)
        )
          return true
        if (
          searchSelectInputValue === 'zipCode' &&
          project.address.zipCode.toLowerCase().includes(searchQuery)
        )
          return true
      } else return true
      return false
    }

    const handlePageChange = (selectedPage) => {
      setCurrentPage(selectedPage.selected)
    }

    const offset = currentPage * itemsPerPage
    const pageCount = Math.ceil(filteredProject.length / itemsPerPage)
    const sortProjects = (projects) =>
      projects.sort((a, b) => {
        let sortValueA, sortValueB

        switch (sortFieldValue) {
          case 'updatedAt':
            sortValueA = moment(a.updatedAt).milliseconds()
            sortValueB = moment(b.updatedAt).milliseconds()
            break
          case 'startDate':
            sortValueA = moment(a.startDate).milliseconds()
            sortValueB = moment(b.startDate).milliseconds()
            break
          case 'completionPercentage':
            sortValueA = a.completionPercentage
            sortValueB = b.completionPercentage
            break
          case 'estimatedCost':
            sortValueA = a.estimatedCost
            sortValueB = b.estimatedCost
            break
          case 'spentCost':
            sortValueA = a.spentCost
            sortValueB = b.spentCost
            break
          case 'estimatedNumberOfDays':
            sortValueA = a.estimatedNumberOfDays
            sortValueB = b.estimatedNumberOfDays
            break
          case 'spentNumberOfDays':
            sortValueA = a.spentNumberOfDays
            sortValueB = b.spentNumberOfDays
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
    const paginatedProjects = sortProjects(
      filteredProject.filter(projectsQueryFilter).slice(offset, offset + itemsPerPage),
    )

    const handleSortSelectFieldChange = (event) => {
      setSortFieldValue(event.target.value)
    }

    return (
      <>
        <div className="d-lg-flex flex-column flex-lg-row justify-content-between">
          <CCard className="mb-3 col-12 col-lg-6">
            <CCardHeader>Filtering Projects</CCardHeader>
            <CCardBody className="d-flex">
              <CFormSelect
                aria-label="Select filter field for projects"
                options={filterSelectOptions}
                className="me-2"
                onChange={HandleSearchSelectChange}
                value={searchSelectInputValue}
              />
              <CFormInput
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
              />
            </CCardBody>
          </CCard>
          <CCard className="mb-3 col-12 col-lg-6 mt-lg-0">
            <CCardHeader>Sorting Projects</CCardHeader>
            <CCardBody className="d-flex">
              <CInputGroup>
                <CFormSelect
                  aria-label="Select Sort field for projects"
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
                    }}
                  >
                    DESC
                  </CButton>
                </CInputGroupText>
              </CInputGroup>
            </CCardBody>
          </CCard>
        </div>

        {paginatedProjects.length > 0
          ? paginatedProjects.map((project, key) => (
              <CCard className="mb-3" key={key}>
                <CCardHeader
                  className={`${
                    state.currentProject?._id?.toString() === project._id.toString()
                      ? 'border border-danger'
                      : ''
                  }`}
                >
                  {project.name}
                </CCardHeader>
                <CCardBody>
                  <CCardText className="descriptionWidth">{project.description}</CCardText>
                  <CTable borderless>
                    <tr>
                      <td>Revenue</td>
                      <td>Rs. {project.revenue}</td>
                    </tr>
                    <tr>
                      <td>Estimated Cost</td>
                      <td>Rs. {project.estimatedCost}</td>
                    </tr>
                    <tr>
                      <td>Profit</td>
                      <td>Rs. {project.profit}</td>
                    </tr>
                    <tr>
                      <td>Estimated Time</td>
                      <td>{project.estimatedNumberOfDays} days</td>
                    </tr>
                    <tr>
                      <td>Project Status</td>
                      <td>{project.status}</td>
                    </tr>
                  </CTable>
                  <div className="text-center">
                    <CButton
                      type="button"
                      color="success"
                      variant="outline"
                      onClick={() => showProject(project)}
                    >
                      Show Details
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            ))
          : handleNoFilteredProjects()}
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
    )
  }

  return isLoading || isFetching ? 'Loading...' : renderProjects()
}

export default Projects
