import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AddProject = React.lazy(() => import('./views/addProject/AddProject'))
const AllProjects = React.lazy(() => import('./views/allProjects/allProjects'))
const CompletedProjects = React.lazy(() => import('./views/completedProjects/completedProjects'))
const RunningProjects = React.lazy(() => import('./views/runningProjects/runningProjects'))
const UpdateProject = React.lazy(() => import('./views/updateProject/updateProject'))
const ShowProject = React.lazy(() => import('./views/projectDetails/projectDetails'))

const page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/addProject', name: 'AddProject', element: AddProject, exact: true },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact: true },
  { path: '/allProjects', name: 'All Projects', element: AllProjects, exact: true },
  {
    path: '/completedProjects',
    name: 'Completed Projects',
    element: CompletedProjects,
    exact: true,
  },
  {
    path: '/updateProject',
    name: 'Update Project',
    element: UpdateProject,
    exact: true,
  },
  {
    path: '/showProject',
    name: 'Show Project',
    element: ShowProject,
    exact: true,
  },
  { path: '/runningProjects', name: 'Running Projects', element: RunningProjects, exact: true },
  { path: '*', name: 'wild', element: page404 },
]

export default routes
